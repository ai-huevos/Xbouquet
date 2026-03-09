'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAdminClaims() {
    const supabase = await createClient()
    const { data: claims, error } = await supabase
        .from('claims')
        .select(`
            id,
            reason,
            requested_credit_amount,
            description,
            status,
            created_at,
            shop:shop_profiles(profile_id, current_balance, profiles(full_name)),
            supplier:supplier_profiles(profile_id, profiles(full_name)),
            order_item:order_items(id, quantity, unit_price, product:flower_products(title))
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching admin claims:', error)
        return []
    }
    return claims
}

export async function resolveAdminClaim(claimId: string, action: 'approved' | 'rejected') {
    const supabase = await createClient()

    // Check if admin
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return { error: 'Not authenticated' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userData.user.id)
        .single()

    if (profile?.role !== 'admin') {
        return { error: 'Not authorized' }
    }

    const { data: claim } = await supabase
        .from('claims')
        .select('shop_id, requested_credit_amount, status')
        .eq('id', claimId)
        .single()

    if (!claim || claim.status !== 'pending') {
        return { error: 'Invalid claim or already processed' }
    }

    const { error: updateError } = await supabase
        .from('claims')
        .update({ status: action })
        .eq('id', claimId)

    if (updateError) return { error: 'Failed to update claim' }

    // If approved, subtract from shop balance (refund)
    if (action === 'approved') {
        const { data: shopProfile } = await supabase
            .from('shop_profiles')
            .select('current_balance')
            .eq('profile_id', claim.shop_id)
            .single()

        if (shopProfile) {
            const newBalance = Math.max(0, shopProfile.current_balance - (claim.requested_credit_amount / 100))
            await supabase
                .from('shop_profiles')
                .update({ current_balance: newBalance })
                .eq('profile_id', claim.shop_id)
        }
    }

    revalidatePath('/admin/disputes')
    return { success: true }
}
