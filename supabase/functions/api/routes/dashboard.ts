import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth.ts'

const dashboard = new Hono()

dashboard.use('*', authMiddleware)

// Supplier dashboard stats (KPI cards)
dashboard.get('/supplier/stats', async (c) => {
    const supabase = c.get('supabase')
    const profile = c.get('profile')

    if (profile.role !== 'supplier') {
        return c.json({ error: 'Supplier only' }, 403)
    }

    const supplierId = profile.id

    // Total sales — sum of delivered order items
    const { data: salesData } = await supabase
        .from('orders')
        .select('order_items(unit_price, quantity)')
        .eq('supplier_id', supplierId)
        .eq('status', 'delivered')

    let totalSales = 0
    if (salesData) {
        for (const order of salesData) {
            const items = order.order_items as { unit_price: number; quantity: number }[]
            if (items) {
                for (const item of items) {
                    totalSales += Number(item.unit_price) * item.quantity
                }
            }
        }
    }

    // Month boundaries
    const now = new Date()
    const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    // Previous month sales
    const { data: lastMonthData } = await supabase
        .from('orders')
        .select('order_items(unit_price, quantity)')
        .eq('supplier_id', supplierId)
        .eq('status', 'delivered')
        .gte('created_at', firstOfLastMonth.toISOString())
        .lt('created_at', firstOfThisMonth.toISOString())

    let previousMonthSales = 0
    if (lastMonthData) {
        for (const order of lastMonthData) {
            const items = order.order_items as { unit_price: number; quantity: number }[]
            if (items) {
                for (const item of items) {
                    previousMonthSales += Number(item.unit_price) * item.quantity
                }
            }
        }
    }

    // This month sales
    const { data: thisMonthData } = await supabase
        .from('orders')
        .select('order_items(unit_price, quantity)')
        .eq('supplier_id', supplierId)
        .eq('status', 'delivered')
        .gte('created_at', firstOfThisMonth.toISOString())

    let thisMonthSales = 0
    if (thisMonthData) {
        for (const order of thisMonthData) {
            const items = order.order_items as { unit_price: number; quantity: number }[]
            if (items) {
                for (const item of items) {
                    thisMonthSales += Number(item.unit_price) * item.quantity
                }
            }
        }
    }

    // Pending orders count
    const { count: pendingOrders } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('supplier_id', supplierId)
        .in('status', ['pending', 'confirmed', 'processing'])

    return c.json({
        totalSales,
        thisMonthSales,
        previousMonthSales,
        pendingOrders: pendingOrders ?? 0,
    })
})

// Supplier orders list
dashboard.get('/supplier/orders', async (c) => {
    const supabase = c.get('supabase')
    const profile = c.get('profile')
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : undefined

    let query = supabase
        .from('orders')
        .select(`
      id,
      status,
      created_at,
      order_items(unit_price, quantity),
      shop:shop_profiles(business_name)
    `)
        .eq('supplier_id', profile.id)
        .order('created_at', { ascending: false })

    if (limit) query = query.limit(limit)

    const { data: ordersData, error } = await query
    if (error) return c.json({ error: error.message }, 500)

    const enriched = (ordersData ?? []).map((order: Record<string, unknown>) => {
        const items = order.order_items as { unit_price: number; quantity: number }[]
        const total = items
            ? items.reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0)
            : 0

        const shopProfile = order.shop as { business_name: string }[] | null
        const shopName = Array.isArray(shopProfile) && shopProfile.length > 0
            ? shopProfile[0].business_name : 'Unknown Shop'

        return {
            id: order.id,
            status: order.status,
            created_at: order.created_at,
            total,
            shop_name: shopName,
        }
    })

    return c.json(enriched)
})

export default dashboard
