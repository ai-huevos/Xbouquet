'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Returns aggregate stats for the supplier dashboard KPI cards.
 * All queries are scoped to the current authenticated supplier via profile lookup.
 */
export async function getSupplierDashboardStats() {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

    if (!profile) return null

    const supplierId = profile.id

    // 1. Total sales — sum of all delivered order items
    const { data: salesData } = await supabase
        .from('orders')
        .select(`
            order_items(unit_price, quantity)
        `)
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

    // 2. Previous month sales (for delta calculation)
    const now = new Date()
    const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const { data: lastMonthData } = await supabase
        .from('orders')
        .select(`
            order_items(unit_price, quantity)
        `)
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

    // 3. This month sales
    const { data: thisMonthData } = await supabase
        .from('orders')
        .select(`
            order_items(unit_price, quantity)
        `)
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

    // 4. Pending orders count
    const { count: pendingOrders } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('supplier_id', supplierId)
        .in('status', ['pending', 'confirmed', 'processing'])

    return {
        totalSales,
        thisMonthSales,
        previousMonthSales,
        pendingOrders: pendingOrders ?? 0,
    }
}

/**
 * Returns recent orders for the supplier, with shop names and computed totals.
 * Used by both the dashboard preview table and the full orders page.
 */
export async function getSupplierOrders(limit?: number) {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) return []

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

    if (!profile) return []

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

    if (limit) {
        query = query.limit(limit)
    }

    const { data: orders, error } = await query

    if (error) {
        console.error('Error fetching supplier orders:', error)
        return []
    }

    return (orders ?? []).map((order) => {
        const items = order.order_items as { unit_price: number; quantity: number }[]
        const total = items
            ? items.reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0)
            : 0

        const shopProfile = order.shop as unknown as { business_name: string }[] | null
        const shopName = Array.isArray(shopProfile) && shopProfile.length > 0
            ? shopProfile[0].business_name
            : 'Unknown Shop'

        return {
            id: order.id,
            status: order.status,
            created_at: order.created_at,
            total,
            shop_name: shopName,
        }
    })
}

/**
 * Updates the status of an order. Supplier can confirm, fulfill, or cancel.
 */
export async function updateOrderStatus(orderId: string, newStatus: string) {
    const validStatuses = ['confirmed', 'delivered', 'cancelled', 'processing']
    if (!validStatuses.includes(newStatus)) {
        return { error: `Invalid status: ${newStatus}` }
    }

    const supabase = await createClient()

    const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

    if (error) {
        console.error('Error updating order status:', error)
        return { error: error.message }
    }

    // Revalidate both the dashboard and orders pages
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/supplier')
    revalidatePath('/supplier/orders')

    return { success: true }
}
