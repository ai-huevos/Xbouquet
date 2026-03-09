/**
 * Dashboard API Client
 * 
 * Replaces: import { ... } from '@/lib/actions/dashboard'
 */

import { serverApiFetch } from './client'

interface SupplierStats {
    totalSales: number
    thisMonthSales: number
    previousMonthSales: number
    pendingOrders: number
}

interface SupplierOrder {
    id: string
    status: string
    created_at: string
    total: number
    shop_name: string
}

export async function getSupplierDashboardStats(): Promise<SupplierStats | null> {
    try {
        return await serverApiFetch<SupplierStats>('/v1/dashboard/supplier/stats')
    } catch {
        return null
    }
}

export async function getSupplierOrders(limit?: number): Promise<SupplierOrder[]> {
    const qs = limit ? `?limit=${limit}` : ''
    return serverApiFetch<SupplierOrder[]>(`/v1/dashboard/supplier/orders${qs}`)
}
