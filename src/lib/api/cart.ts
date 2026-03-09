/**
 * Cart API Client
 * 
 * Replaces: import { ... } from '@/lib/actions/cart'
 */

import { apiFetch, serverApiFetch } from './client'

interface CartGroup {
    supplier: { profile_id: string; business_name: string }
    items: Array<{
        id: string
        quantity: number
        lineTotal: number
        product_id: string
        product: {
            id: string
            name: string
            price_per_unit: number
            stock_qty: number
            image_url: string | null
            supplier: { profile_id: string; business_name: string }
        }
    }>
    subtotal: number
}

interface CartResponse {
    grouped: CartGroup[]
    totalCount: number
    totalPrice: number
}

export async function getCart(): Promise<CartResponse> {
    return serverApiFetch<CartResponse>('/v1/cart')
}

export async function addToCart(productId: string, quantity: number) {
    return apiFetch<{ success: boolean }>('/v1/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
    })
}

export async function updateCartItem(cartItemId: string, quantity: number) {
    return apiFetch<{ success: boolean }>(`/v1/cart/${cartItemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
    })
}

export async function removeFromCart(cartItemId: string) {
    return apiFetch<{ success: boolean }>(`/v1/cart/${cartItemId}`, {
        method: 'DELETE',
    })
}
