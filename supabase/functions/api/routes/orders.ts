import { Hono } from 'https://deno.land/x/hono@v4.6.20/mod.ts'
import { authMiddleware } from '../middleware/auth.ts'

const orders = new Hono()

orders.use('*', authMiddleware)

// Get orders (role-filtered)
orders.get('/', async (c) => {
    const supabase = c.get('supabase')
    const profile = c.get('profile')
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : undefined

    let query = supabase
        .from('orders')
        .select(`
      id,
      status,
      created_at,
      order_type,
      requested_delivery_date,
      order_items(unit_price, quantity, product:flower_products(name)),
      shop:shop_profiles(business_name),
      supplier:supplier_profiles(business_name)
    `)
        .order('created_at', { ascending: false })

    // Scope by role
    if (profile.role === 'supplier') {
        query = query.eq('supplier_id', profile.id)
    } else {
        query = query.eq('shop_id', profile.id)
    }

    if (limit) query = query.limit(limit)

    const { data, error } = await query
    if (error) return c.json({ error: error.message }, 500)

    // Compute totals
    const enriched = (data ?? []).map((order: Record<string, unknown>) => {
        const items = order.order_items as { unit_price: number; quantity: number }[]
        const total = items
            ? items.reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0)
            : 0

        const shopProfile = order.shop as { business_name: string }[] | null
        const supplierProfile = order.supplier as { business_name: string }[] | null

        return {
            id: order.id,
            status: order.status,
            created_at: order.created_at,
            order_type: order.order_type,
            requested_delivery_date: order.requested_delivery_date,
            total,
            shop_name: Array.isArray(shopProfile) && shopProfile.length > 0
                ? shopProfile[0].business_name : 'Unknown Shop',
            supplier_name: Array.isArray(supplierProfile) && supplierProfile.length > 0
                ? supplierProfile[0].business_name : 'Unknown Supplier',
            items: order.order_items,
        }
    })

    return c.json(enriched)
})

// Get single order
orders.get('/:id', async (c) => {
    const supabase = c.get('supabase')
    const id = c.req.param('id')

    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      order_items(*, product:flower_products(name, image_url)),
      shop:shop_profiles(business_name),
      supplier:supplier_profiles(business_name)
    `)
        .eq('id', id)
        .single()

    if (error) return c.json({ error: 'Order not found' }, 404)
    return c.json(data)
})

// Update order status (supplier)
orders.put('/:id/status', async (c) => {
    const supabase = c.get('supabase')
    const profile = c.get('profile')
    const orderId = c.req.param('id')
    const { status } = await c.req.json()

    const validStatuses = ['confirmed', 'delivered', 'cancelled', 'processing']
    if (!validStatuses.includes(status)) {
        return c.json({ error: `Invalid status: ${status}` }, 400)
    }

    // RLS will ensure they can only update their own orders
    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

    if (error) return c.json({ error: error.message }, 400)
    return c.json({ success: true })
})

export default orders
