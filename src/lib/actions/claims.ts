'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createClaim(formData: FormData) {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) return { error: 'Not authenticated' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()
    if (!profile) return { error: 'Profile not found' }

    const orderItemId = formData.get('order_item_id') as string
    const reason = formData.get('reason') as string
    const requestedCreditAmount = parseFloat(formData.get('requested_credit_amount') as string) * 100 // convert to cents
    const description = formData.get('description') as string

    // In a real app we'd upload images and get the URLs, handling simply for MVP
    const evidenceUrls: string[] = []

    if (!orderItemId || !reason || !description || isNaN(requestedCreditAmount)) {
        return { error: 'Missing required fields' }
    }

    // Verify the order item belongs to this shop
    const { data: orderItem, error: itemError } = await supabase
        .from('order_items')
        .select('order:orders ( shop_id, supplier_id )')
        .eq('id', orderItemId)
        .single()

    if (itemError || !orderItem || (orderItem.order as any).shop_id !== profile.id) {
        return { error: 'Invalid order item' }
    }

    const { error: claimError } = await supabase
        .from('claims')
        .insert({
            order_item_id: orderItemId,
            shop_id: profile.id,
            supplier_id: (orderItem.order as any).supplier_id,
            reason,
            requested_credit_amount: requestedCreditAmount,
            description,
            evidence_url_array: evidenceUrls,
            status: 'pending'
        })

    if (claimError) {
        console.error('Error creating claim:', claimError)
        return { error: 'Failed to submit claim' }
    }

    // Revalidate the order page so the claim shows up
    revalidatePath(`/shop/orders`)
    return { success: true }
}

export async function updateClaimStatus(claimId: string, status: 'approved' | 'rejected', resolutionNotes: string) {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) return { error: 'Not authenticated' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()
    if (!profile) return { error: 'Profile not found' }

    // Verify claim belongs to this supplier
    const { data: claim, error: fetchError } = await supabase
        .from('claims')
        .select('shop_id, requested_credit_amount, status, supplier_id')
        .eq('id', claimId)
        .single()

    if (fetchError || !claim || claim.supplier_id !== profile.id) {
        return { error: 'Invalid claim or permission denied' }
    }

    if (claim.status !== 'pending') {
        return { error: 'Claim is already ' + claim.status }
    }

    try {
        // Start transaction manually since Supabase js doesn't have true transactions
        // Or handle via RPC if strong consistency is needed. doing two updates for MVP.
        const { error: updateError } = await supabase
            .from('claims')
            .update({
                status,
                resolution_notes: resolutionNotes,
                updated_at: new Date().toISOString()
            })
            .eq('id', claimId)

        if (updateError) throw updateError

        if (status === 'approved') {
            // Credit the shop's balance by reducing their current balance
            // Need to fetch current balance first
            const { data: shopProfile } = await supabase
                .from('shop_profiles')
                .select('current_balance')
                .eq('profile_id', claim.shop_id)
                .single()

            if (shopProfile) {
                // If current balance is 1000, and credit is 100, new balance is 900
                const newBalance = Math.max(0, shopProfile.current_balance - (claim.requested_credit_amount / 100))

                await supabase
                    .from('shop_profiles')
                    .update({ current_balance: newBalance })
                    .eq('profile_id', claim.shop_id)
            }
        }
    } catch (err) {
        console.error('Error updating claim:', err)
        return { error: 'Failed to update claim status' }
    }

    revalidatePath('/supplier/dashboard') // or whichever route shows supplier claims
    return { success: true }
}
