'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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
                price_per_unit,
                stock_qty,
                supplier_id
            )
        `)
        .eq('shop_id', profile.id)

    if (cartError || !cartItems || cartItems.length === 0) {
        return { error: 'Cart is empty or could not be fetched' }
    }

    // 2. Group items by supplier to prepare payload
    const supplierGroups: Record<string, typeof cartItems> = {}

    // Validate stock simultaneously
    for (const item of cartItems) {
        const prod = item.product as unknown as { stock_qty: number; supplier_id: string; id: string; price_per_unit: number; }
        if (item.quantity > prod.stock_qty) {
            return { error: `Insufficient stock for product ID: ${prod.id}` }
        }

        const supplierId = prod.supplier_id
        if (!supplierGroups[supplierId]) {
            supplierGroups[supplierId] = []
        }
        supplierGroups[supplierId].push(item)
    }

    let orderGroupId: string;

    // Use a Supabase RPC wrapper if complex atomic transactions are strictly required.
    // However, since we define RPCs as optional in MVP, we will run the sequence sequentially 
    // but rollback-capable in the frontend logic. Given MVP constraints, sequential chained inserts are standard.

    try {
        // Step A: Create order_group
        const { data: groupData, error: groupError } = await supabase
            .from('order_groups')
            .insert({ shop_id: profile.id })
            .select('id')
            .single()

        if (groupError) {
            console.error("checkout: Error creating order_group", groupError)
            throw groupError
        }
        orderGroupId = groupData.id

        // Step B: Loop over supplier groups
        for (const [supplierId, items] of Object.entries(supplierGroups)) {
            // 1. Create order
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert({
                    order_group_id: orderGroupId,
                    shop_id: profile.id,
                    supplier_id: supplierId,
                    status: 'pending'
                })
                .select('id')
                .single()

            if (orderError) {
                console.error(`checkout: Error creating order for supplier ${supplierId}`, orderError)
                throw orderError
            }

            const orderId = orderData.id

            // 2. Create order_items and decrement stock
            const orderItemsPayload = items.map(item => {
                const prod = item.product as unknown as { price_per_unit: number; stock_qty: number; id: string; }
                return {
                    order_id: orderId,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: prod.price_per_unit
                }
            })

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItemsPayload)

            if (itemsError) {
                console.error(`checkout: Error creating order_items for order ${orderId}`, itemsError)
                throw itemsError
            }

            // Decrement stock (Warning: Sequential updates are race-condition prone without RPC. 
            // In a production app, an RPC like decrement_stock(id, qty) is necessary.
            // For this phase, we read above and update here)
            for (const item of items) {
                const prod = item.product as unknown as { stock_qty: number; id: string; price_per_unit: number; }
                const { error: stockError } = await supabase
                    .from('flower_products')
                    .update({ stock_qty: prod.stock_qty - item.quantity })
                    .eq('id', item.product_id)

                if (stockError) {
                    console.error(`checkout: Error decrementing stock for product ${item.product_id}`, stockError)
                    throw stockError
                }
            }
        }

        // Step C: Clear the cart
        const { error: clearError } = await supabase
            .from('cart_items')
            .delete()
            .eq('shop_id', profile.id)

        if (clearError) throw clearError

    } catch (err) {
        console.error('Checkout error:', err)
        return { error: err instanceof Error ? err.message : 'An error occurred during checkout' }
    }

    // Redirect on success
    redirect(`/checkout/success`)
}
