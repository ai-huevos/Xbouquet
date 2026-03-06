import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const payload = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature') as string

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            payload,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err) {
        console.error(`Webhook signature verification failed.`, err)
        return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        const shopId = session.metadata?.shop_id

        if (!shopId) {
            console.error('Webhook Error: Missing shop_id in metadata')
            return NextResponse.json({ error: 'Missing shop_id' }, { status: 400 })
        }

        const supabase = await createClient()

        try {
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
                .eq('shop_id', shopId)

            if (cartError || !cartItems || cartItems.length === 0) {
                console.error('Webhook Error: Cart is empty or could not be fetched', cartError)
                return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
            }

            // 2. Group items by supplier
            const supplierGroups: Record<string, typeof cartItems> = {}

            // Validate stock simultaneously (we checked before creating session, but validating again to be safe)
            for (const item of cartItems) {
                const prod = item.product as unknown as { stock_qty: number; supplier_id: string; id: string; price_per_unit: number; }
                if (item.quantity > prod.stock_qty) {
                    console.error(`Webhook Error: Insufficient stock for product ID: ${prod.id}`)
                    // NOTE: In a production app you would refund the user here. For MVP we log the error.
                    return NextResponse.json({ error: `Insufficient stock for product ID: ${prod.id}` }, { status: 400 })
                }

                const supplierId = prod.supplier_id
                if (!supplierGroups[supplierId]) {
                    supplierGroups[supplierId] = []
                }
                supplierGroups[supplierId].push(item)
            }

            // Step A: Create order_group
            const { data: groupData, error: groupError } = await supabase
                .from('order_groups')
                .insert({ shop_id: shopId })
                .select('id')
                .single()

            if (groupError) {
                console.error("Webhook Error creating order_group", groupError)
                throw groupError
            }
            const orderGroupId = groupData.id

            // Step B: Loop over supplier groups
            for (const [supplierId, items] of Object.entries(supplierGroups)) {
                // 1. Create order
                const { data: orderData, error: orderError } = await supabase
                    .from('orders')
                    .insert({
                        order_group_id: orderGroupId,
                        shop_id: shopId,
                        supplier_id: supplierId,
                        status: 'pending'
                    })
                    .select('id')
                    .single()

                if (orderError) {
                    console.error(`Webhook Error creating order for supplier ${supplierId}`, orderError)
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
                    console.error(`Webhook Error creating order_items for order ${orderId}`, itemsError)
                    throw itemsError
                }

                // Decrement stock
                for (const item of items) {
                    const prod = item.product as unknown as { stock_qty: number; id: string; price_per_unit: number; }
                    const { error: stockError } = await supabase
                        .from('flower_products')
                        .update({ stock_qty: prod.stock_qty - item.quantity })
                        .eq('id', item.product_id)

                    if (stockError) {
                        console.error(`Webhook Error decrementing stock for product ${item.product_id}`, stockError)
                        throw stockError
                    }
                }
            }

            // Step C: Clear the cart
            const { error: clearError } = await supabase
                .from('cart_items')
                .delete()
                .eq('shop_id', shopId)

            if (clearError) throw clearError

            console.log(`Successfully processed order group ${orderGroupId} for shop ${shopId} from Stripe webhook.`)

        } catch (err) {
            console.error('Webhook Checkout error:', err)
            return NextResponse.json({ error: err instanceof Error ? err.message : 'An error occurred during checkout fulfillment' }, { status: 500 })
        }
    }

    return NextResponse.json({ received: true })
}
