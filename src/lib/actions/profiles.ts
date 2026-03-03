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
