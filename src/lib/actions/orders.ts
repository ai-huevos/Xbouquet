'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import { stripe } from '@/lib/stripe'

export async function checkout() {
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
