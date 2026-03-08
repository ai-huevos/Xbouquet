'use server'

import { createClient } from '@/lib/supabase/server'

export type SupplierAnalytics = {
    totalRevenue: number
    totalOrders: number
    fulfilledOrders: number
    cancelledOrders: number
    fulfillmentRate: number
    avgOrderValue: number
    monthlyRevenue: { month: string; revenue: number }[]
    topProducts: { name: string; unitsSold: number; revenue: number; pctOfTotal: number }[]
    revenueByOrderType: { type: string; revenue: number; count: number }[]
}

export async function getSupplierAnalytics(): Promise<SupplierAnalytics | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()
    if (!profile) return null

    // Fetch all orders for this supplier with items
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
            id, status, order_type, created_at,
            order_items (
                id, quantity, unit_price,
                product:flower_products ( id, name )
            )
        `)
        .eq('supplier_id', profile.id)

    if (ordersError || !orders) {
        console.error('Analytics: error fetching orders', ordersError)
        return {
            totalRevenue: 0,
            totalOrders: 0,
            fulfilledOrders: 0,
            cancelledOrders: 0,
            fulfillmentRate: 0,
            avgOrderValue: 0,
            monthlyRevenue: [],
            topProducts: [],
            revenueByOrderType: [],
        }
    }

    // Process orders
    let totalRevenue = 0
    let fulfilledOrders = 0
    let cancelledOrders = 0
    const monthMap = new Map<string, number>()
    const productMap = new Map<string, { name: string; unitsSold: number; revenue: number }>()
    const orderTypeMap = new Map<string, { revenue: number; count: number }>()

    for (const order of orders) {
        const items = (order.order_items as unknown as { quantity: number; unit_price: number; product: { id: string; name: string } | null }[]) || []
        let orderTotal = 0

        for (const item of items) {
            const lineTotal = item.quantity * item.unit_price
            orderTotal += lineTotal

            const prodName = item.product?.name || 'Unknown'
            const prodId = item.product?.id || 'unknown'
            const existing = productMap.get(prodId) || { name: prodName, unitsSold: 0, revenue: 0 }
            existing.unitsSold += item.quantity
            existing.revenue += lineTotal
            productMap.set(prodId, existing)
        }

        if (order.status !== 'cancelled') {
            totalRevenue += orderTotal
        }

        if (order.status === 'delivered') fulfilledOrders++
        if (order.status === 'cancelled') cancelledOrders++

        // Monthly aggregation
        const monthKey = new Date(order.created_at).toISOString().slice(0, 7)
        if (order.status !== 'cancelled') {
            monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + orderTotal)
        }

        // Order type aggregation
        const orderType = order.order_type || 'immediate'
        const typeEntry = orderTypeMap.get(orderType) || { revenue: 0, count: 0 }
        if (order.status !== 'cancelled') {
            typeEntry.revenue += orderTotal
            typeEntry.count++
        }
        orderTypeMap.set(orderType, typeEntry)
    }

    const totalOrders = orders.length
    const nonCancelledOrders = totalOrders - cancelledOrders
    const fulfillmentRate = nonCancelledOrders > 0 ? (fulfilledOrders / nonCancelledOrders) * 100 : 0
    const avgOrderValue = nonCancelledOrders > 0 ? totalRevenue / nonCancelledOrders : 0

    // Sort monthly revenue by date, last 6 months
    const sortedMonths = [...monthMap.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([month, revenue]) => ({
            month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            revenue,
        }))

    // Top 5 products by revenue
    const topProducts = [...productMap.values()]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(p => ({
            ...p,
            pctOfTotal: totalRevenue > 0 ? (p.revenue / totalRevenue) * 100 : 0
        }))

    // Revenue by order type
    const revenueByOrderType = [...orderTypeMap.entries()].map(([type, data]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        ...data,
    }))

    return {
        totalRevenue,
        totalOrders,
        fulfilledOrders,
        cancelledOrders,
        fulfillmentRate,
        avgOrderValue,
        monthlyRevenue: sortedMonths,
        topProducts,
        revenueByOrderType,
    }
}
