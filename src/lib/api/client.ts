/**
 * API Client — Base fetch wrapper for the REST API
 * 
 * Replaces direct server action imports. All API calls go through this client.
 * 
 * Usage:
 *   import { apiFetch } from '@/lib/api/client'
 *   const products = await apiFetch<Product[]>('/v1/products')
 */

import { createClient } from '@/lib/supabase/client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:54321/functions/v1/api'

interface ApiError {
    error: string
}

/**
 * Get the current Supabase session token for API authorization.
 */
async function getAuthToken(): Promise<string | null> {
    try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        return session?.access_token ?? null
    } catch {
        return null
    }
}

/**
 * Base API fetch wrapper with auth and error handling.
 */
export async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const token = await getAuthToken()

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    // Don't set Content-Type for FormData (browser sets it with boundary)
    if (options.body instanceof FormData) {
        delete headers['Content-Type']
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    })

    if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
            error: `HTTP ${response.status}: ${response.statusText}`,
        }))
        throw new Error(error.error)
    }

    return response.json() as Promise<T>
}

/**
 * Server-side API fetch — for use in React Server Components.
 * Passes the auth token from the server-side Supabase session.
 */
export async function serverApiFetch<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    // Dynamic import to avoid bundling server-only code in client
    const { createClient: createServerClient } = await import('@/lib/supabase/server')
    const supabase = await createServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    }

    if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
        cache: 'no-store', // RSC should always get fresh data from API
    })

    if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
            error: `HTTP ${response.status}: ${response.statusText}`,
        }))
        throw new Error(error.error)
    }

    return response.json() as Promise<T>
}
