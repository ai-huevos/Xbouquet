/**
 * Profiles API Client
 * 
 * Replaces: import { ... } from '@/lib/actions/profiles'
 */

import { serverApiFetch, apiFetch } from './client'

interface FullProfile {
    id: string
    role: string
    full_name: string
    email?: string
    businessProfile: Record<string, unknown> | null
}

export async function getProfile() {
    return serverApiFetch<FullProfile>('/v1/profiles/me')
}

export async function getFullProfile() {
    return serverApiFetch<FullProfile>('/v1/profiles/me')
}

export async function updateProfile(data: { full_name: string }) {
    return apiFetch<{ success: boolean }>('/v1/profiles/me', {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}
