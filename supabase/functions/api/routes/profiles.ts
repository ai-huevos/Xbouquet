import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth.ts'

const profiles = new Hono()

profiles.use('*', authMiddleware)

profiles.get('/me', async (c) => {
    const supabase = c.get('supabase')
    const user = c.get('user')
    const profile = c.get('profile')

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

    return c.json({
        ...profile,
        email: user.email,
        businessProfile,
    })
})

profiles.put('/me', async (c) => {
    const supabase = c.get('supabase')
    const user = c.get('user')
    const { full_name } = await c.req.json()

    const { error } = await supabase
        .from('profiles')
        .update({ full_name, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)

    if (error) return c.json({ error: error.message }, 400)
    return c.json({ success: true })
})

export default profiles
