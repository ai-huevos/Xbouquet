'use server'

import { createClient } from '@/lib/supabase/server'

export type ShopBillingData = {
    creditLimit: number
    currentBalance: number
    availableCredit: number
    paymentTerms: string
    transactions: {
        orderId: string
        orderDate: string
        supplierName: string
        amount: number
        status: string
        dueDate: string
    }[]
}

export type InvoiceData = {
    invoiceNumber: string
    orderDate: string
    dueDate: string
    shopName: string
    shopBusinessName: string
    supplierName: string
    paymentTerms: string
    items: {
        productName: string
        quantity: number
        unitPrice: number
        lineTotal: number
    }[]
    subtotal: number
    total: number
    status: string
}

function getPaymentTermsDays(terms: string): number {
    switch (terms) {
        case 'net_15': return 15
        case 'net_30': return 30
        case 'net_60': return 60
        default: return 0
    }
}

function formatPaymentTerms(terms: string): string {
    switch (terms) {
        case 'net_15': return 'Net 15'
        case 'net_30': return 'Net 30'
        case 'net_60': return 'Net 60'
        case 'due_on_receipt': return 'Due on Receipt'
        default: return terms
    }
}

export async function getShopBilling(): Promise<ShopBillingData | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()
    if (!profile) return null

    // Get shop profile with billing info
    const { data: shopProfile } = await supabase
        .from('shop_profiles')
        .select('credit_limit, current_balance, payment_terms, business_name')
        .eq('profile_id', profile.id)
        .single()

    if (!shopProfile) return null

    const paymentTerms = shopProfile.payment_terms || 'due_on_receipt'
    const termDays = getPaymentTermsDays(paymentTerms)

    // Get orders with supplier info
    const { data: orders } = await supabase
        .from('orders')
        .select(`
            id, status, created_at,
            supplier:supplier_profiles!supplier_id ( business_name ),
            order_items ( quantity, unit_price )
        `)
        .eq('shop_id', profile.id)
        .order('created_at', { ascending: false })

    const transactions = (orders || []).map(order => {
        const items = (order.order_items as unknown as { quantity: number; unit_price: number }[]) || []
        const amount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
        const supplierData = order.supplier as unknown as { business_name: string } | null
        const orderDate = new Date(order.created_at)
        const dueDate = new Date(orderDate)
        dueDate.setDate(dueDate.getDate() + termDays)

        return {
            orderId: order.id,
            orderDate: order.created_at,
            supplierName: supplierData?.business_name || 'Unknown Supplier',
            amount,
            status: order.status,
            dueDate: dueDate.toISOString(),
        }
    })

    return {
        creditLimit: shopProfile.credit_limit,
        currentBalance: shopProfile.current_balance,
        availableCredit: shopProfile.credit_limit - shopProfile.current_balance,
        paymentTerms: formatPaymentTerms(paymentTerms),
        transactions,
    }
}

export async function getInvoiceData(orderId: string): Promise<InvoiceData | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('user_id', user.id)
        .single()
    if (!profile) return null

    const { data: shopProfile } = await supabase
        .from('shop_profiles')
        .select('business_name, payment_terms')
        .eq('profile_id', profile.id)
        .single()
    if (!shopProfile) return null

    const { data: order } = await supabase
        .from('orders')
        .select(`
            id, status, created_at,
            supplier:supplier_profiles!supplier_id ( business_name ),
            order_items (
                quantity, unit_price,
                product:flower_products ( name )
            )
        `)
        .eq('id', orderId)
        .eq('shop_id', profile.id)
        .single()

    if (!order) return null

    const items = (order.order_items as unknown as { quantity: number; unit_price: number; product: { name: string } | null }[]) || []
    const lineItems = items.map(item => ({
        productName: item.product?.name || 'Unknown Product',
        quantity: item.quantity,
        unitPrice: item.unit_price,
        lineTotal: item.quantity * item.unit_price,
    }))

    const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0)
    const supplierData = order.supplier as unknown as { business_name: string } | null
    const paymentTerms = shopProfile.payment_terms || 'due_on_receipt'
    const termDays = getPaymentTermsDays(paymentTerms)
    const orderDate = new Date(order.created_at)
    const dueDate = new Date(orderDate)
    dueDate.setDate(dueDate.getDate() + termDays)

    // Generate an invoice number from the order ID
    const invoiceNumber = `INV-${order.id.slice(0, 8).toUpperCase()}`

    return {
        invoiceNumber,
        orderDate: order.created_at,
        dueDate: dueDate.toISOString(),
        shopName: profile.full_name || 'Shop',
        shopBusinessName: shopProfile.business_name || 'Shop Business',
        supplierName: supplierData?.business_name || 'Supplier',
        paymentTerms: formatPaymentTerms(paymentTerms),
        items: lineItems,
        subtotal,
        total: subtotal,
        status: order.status,
    }
}
