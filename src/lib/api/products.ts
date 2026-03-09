/**
 * Products API Client
 * 
 * Replaces: import { ... } from '@/lib/actions/products'
 */

import { apiFetch, serverApiFetch } from './client'
import type { FlowerProductWithCategory, FlowerProductWithSupplier, ProductCategory } from '@/types/products'

// ── Server-side (RSC) ────────────────────────────────────────────────

export async function getCategories(): Promise<ProductCategory[]> {
    return serverApiFetch<ProductCategory[]>('/v1/products/categories')
}

export async function getProducts(search?: string, categoryId?: string): Promise<FlowerProductWithSupplier[]> {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (categoryId) params.set('category', categoryId)
    const qs = params.toString()
    return serverApiFetch<FlowerProductWithSupplier[]>(`/v1/products${qs ? `?${qs}` : ''}`)
}

export async function getProduct(id: string): Promise<FlowerProductWithSupplier | null> {
    try {
        return await serverApiFetch<FlowerProductWithSupplier>(`/v1/products/${id}`)
    } catch {
        return null
    }
}

export async function getSupplierProducts(): Promise<FlowerProductWithCategory[]> {
    return serverApiFetch<FlowerProductWithCategory[]>('/v1/products/mine')
}

// ── Client-side (mutations) ──────────────────────────────────────────

export async function createProduct(values: Record<string, unknown>) {
    return apiFetch<{ success: boolean }>('/v1/products', {
        method: 'POST',
        body: JSON.stringify(values),
    })
}

export async function bulkCreateProducts(products: Record<string, unknown>[]) {
    return apiFetch<{ success: boolean; insertedCount: number; errors?: string[] }>('/v1/products/bulk', {
        method: 'POST',
        body: JSON.stringify({ products }),
    })
}

export async function updateProduct(id: string, values: Record<string, unknown>) {
    return apiFetch<{ success: boolean }>(`/v1/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(values),
    })
}

export async function deleteProduct(id: string) {
    return apiFetch<{ success: boolean }>(`/v1/products/${id}`, {
        method: 'DELETE',
    })
}

export async function uploadProductImage(formData: FormData) {
    return apiFetch<{ success: boolean; url: string }>('/v1/products/image', {
        method: 'POST',
        body: formData,
    })
}
