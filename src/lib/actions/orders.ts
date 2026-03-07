'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import { stripe } from '@/lib/stripe'

export async function checkout(formData?: FormData) {
    const orderType = formData?.get('order_type') as string || 'immediate'
    const requestedDeliveryDate = formData?.get('requested_delivery_date') as string || null
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
        console.error("checkout: Not authenticated", userError)
        return { error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

    if (!profile) {
        console.error("checkout: Profile not found for User:", userData.user.id)
        return { error: 'Profile not found' }
    }

    // 1. Fetch entire cart for the user
    const { data: cartItems, error: cartError } = await supabase
        .from('cart_items')
        .select(`
            id,
            quantity,
            product_id,
            product:flower_products (
                id,
                name,
                price_per_unit,
                stock_qty,
                supplier_id
            )
        `)
        .eq('shop_id', profile.id)

    if (cartError || !cartItems || cartItems.length === 0) {
        return { error: 'Cart is empty or could not be fetched' }
    }

    // 2. Validate stock and build Stripe line_items
    const lineItems: import('stripe').Stripe.Checkout.SessionCreateParams.LineItem[] = []

    for (const item of cartItems) {
        const prod = item.product as unknown as { name: string; stock_qty: number; supplier_id: string; id: string; price_per_unit: number; }
        if (item.quantity > prod.stock_qty) {
            return { error: `Insufficient stock for product ID: ${prod.id}` }
        }

        lineItems.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: prod.name,
                },
                unit_amount: prod.price_per_unit, // amount in cents
            },
            quantity: item.quantity,
        })
    }

    let sessionUrl: string | null = null;

    try {
        // 3. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/payment`,
            metadata: {
                shop_id: profile.id, // Store shop_id to fulfill the order via webhook
                order_type: orderType,
                ...(requestedDeliveryDate ? { requested_delivery_date: requestedDeliveryDate } : {})
            },
        })

        sessionUrl = session.url;

    } catch (err) {
        console.error('Checkout error:', err)
        return { error: err instanceof Error ? err.message : 'An error occurred initiating checkout' }
    }

    // Redirect to Stripe Checkout page
    if (sessionUrl) {
        redirect(sessionUrl)
    } else {
        return { error: 'Failed to create Stripe session' }
    }
}

export async function createAccountOrder(formData: FormData) {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) return { error: 'Not authenticated' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()
    if (!profile) return { error: 'Profile not found' }

    const { data: shopProfile } = await supabase
        .from('shop_profiles')
        .select('credit_limit, current_balance, payment_terms')
        .eq('profile_id', profile.id)
        .single()

    if (!shopProfile || shopProfile.payment_terms === 'due_on_receipt') {
        return { error: 'Must have approved payment terms for Account checkout' }
    }

    // 1. Fetch entire cart for the user
    const { data: cartItems, error: cartError } = await supabase
        .from('cart_items')
        .select(`
            id, quantity, product_id,
            product:flower_products ( id, name, price_per_unit, stock_qty, supplier_id )
        `)
        .eq('shop_id', profile.id)

    if (cartError || !cartItems || cartItems.length === 0) return { error: 'Cart is empty' }

    // Calculate total cost
    let totalCents = 0
    const supplierGroups: Record<string, typeof cartItems> = {}

    for (const item of cartItems) {
        const prod = item.product as unknown as { stock_qty: number; supplier_id: string; id: string; price_per_unit: number; }
        if (item.quantity > prod.stock_qty) return { error: `Insufficient stock for product ID: ${prod.id}` }

        totalCents += (prod.price_per_unit * item.quantity)

        if (!supplierGroups[prod.supplier_id]) supplierGroups[prod.supplier_id] = []
        supplierGroups[prod.supplier_id].push(item)
    }

    const totalDollars = totalCents / 100
    const availableCredit = shopProfile.credit_limit - shopProfile.current_balance

    if (totalDollars > availableCredit) {
        return { error: 'Insufficient credit limit available' }
    }

    const orderType = formData.get('order_type') as string || 'immediate'
    const requestedDeliveryDate = formData.get('requested_delivery_date') as string || null

    try {
        // Step A: Create order_group
        const { data: groupData, error: groupError } = await supabase
            .from('order_groups')
            .insert({ shop_id: profile.id, payment_status: 'paid' }) // Mark paid/pending_terms depending on logic. Let's say paid so it clears for fulfillment
            .select('id')
            .single()
        if (groupError) throw groupError

        // Step B: Loop over supplier groups
        for (const [supplierId, items] of Object.entries(supplierGroups)) {
            const orderInsertData: any = {
                order_group_id: groupData.id,
                shop_id: profile.id,
                supplier_id: supplierId,
                status: 'pending',
                order_type: orderType
            }
            if (requestedDeliveryDate) orderInsertData.requested_delivery_date = requestedDeliveryDate

            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert(orderInsertData)
                .select('id')
                .single()
            if (orderError) throw orderError

            const orderItemsPayload = items.map(item => {
                const prod = item.product as unknown as { price_per_unit: number; stock_qty: number; id: string; }
                return {
                    order_id: orderData.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: prod.price_per_unit
                }
            })

            const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload)
            if (itemsError) throw itemsError

            // Decrement stock
            for (const item of items) {
                const prod = item.product as unknown as { stock_qty: number; id: string; price_per_unit: number; }
                const { error: stockError } = await supabase
                    .from('flower_products')
                    .update({ stock_qty: prod.stock_qty - item.quantity })
                    .eq('id', item.product_id)
                if (stockError) throw stockError
            }
        }

        // Step C: Clear the cart
        const { error: clearError } = await supabase.from('cart_items').delete().eq('shop_id', profile.id)
        if (clearError) throw clearError

        // Step D: Update shop balance
        const { error: balanceError } = await supabase
            .from('shop_profiles')
            .update({ current_balance: shopProfile.current_balance + totalDollars })
            .eq('profile_id', profile.id)
        if (balanceError) throw balanceError

    } catch (err) {
        console.error('Account Checkout error:', err)
        return { error: 'An error occurred fulfilling account order' }
    }

    redirect('/checkout/success')
}
