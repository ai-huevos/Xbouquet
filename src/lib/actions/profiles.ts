'use server'

import { createClient } from '@/lib/supabase/server'

export async function getProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (error) {
        console.error('Error fetching profile:', error)
        return null
    }

    return profile
}

export async function getFullProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Get base profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (profileError || !profile) {
        console.error('Error fetching profile:', profileError)
        return null
    }

    // Get role-specific sub-profile
    let businessProfile = null
    if (profile.role === 'shop') {
        const { data } = await supabase
            .from('shop_profiles')
            .select('*')
            .eq('profile_id', profile.id)
            .single()
        businessProfile = data
    } else if (profile.role === 'supplier') {
        const { data } = await supabase
            .from('supplier_profiles')
            .select('*')
            .eq('profile_id', profile.id)
            .single()
        businessProfile = data
    }

    return {
        ...profile,
        email: user.email,
        businessProfile,
    }
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const full_name = formData.get('full_name') as string

    const { error } = await supabase
        .from('profiles')
        .update({ full_name, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}
