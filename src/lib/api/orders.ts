/**
 * Orders API Client
 * 
 * Replaces: import { ... } from '@/lib/actions/orders'
 */

import { apiFetch, serverApiFetch } from './client'

interface OrderSummary {
    id: string
    status: string
    created_at: string
    order_type?: string
    requested_delivery_date?: string
    total: number
    shop_name: string
    supplier_name: string
    items?: Array<{ unit_price: number; quantity: number }>
}

export async function getOrders(limit?: number): Promise<OrderSummary[]> {
    const qs = limit ? `?limit=${limit}` : ''
    return serverApiFetch<OrderSummary[]>(`/v1/orders${qs}`)
}

export async function getOrder(id: string) {
    return serverApiFetch<Record<string, unknown>>(`/v1/orders/${id}`)
}

export async function updateOrderStatus(orderId: string, status: string) {
    return apiFetch<{ success: boolean }>(`/v1/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    })
}
