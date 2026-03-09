import { Hono } from 'https://deno.land/x/hono@v4.6.20/mod.ts'
import { createSupabaseClient } from '../lib/supabase.ts'

const auth = new Hono()

auth.post('/signup', async (c) => {
    const { email, password, full_name, role } = await c.req.json()

    if (!email || !password || !role) {
        return c.json({ error: 'Email, password, and role are required' }, 400)
    }

    if (!['shop', 'supplier'].includes(role)) {
        return c.json({ error: 'Role must be shop or supplier' }, 400)
    }

    const supabase = createSupabaseClient()

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { role, full_name },
        },
    })

    if (error) return c.json({ error: error.message }, 400)

    return c.json({
        success: true,
        user: data.user,
        session: data.session,
        role,
    }, 201)
})

auth.post('/signin', async (c) => {
    const { email, password } = await c.req.json()

    if (!email || !password) {
        return c.json({ error: 'Email and password are required' }, 400)
    }

    const supabase = createSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) return c.json({ error: error.message }, 401)

    const role = data.user?.user_metadata?.role || 'shop'

    return c.json({
        success: true,
        user: data.user,
        session: data.session,
        role,
    })
})

auth.post('/signout', async (c) => {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) return c.json({ success: true })

    const supabase = createSupabaseClient(authHeader)
    await supabase.auth.signOut()

    return c.json({ success: true })
})

auth.post('/refresh', async (c) => {
    const { refresh_token } = await c.req.json()
    if (!refresh_token) {
        return c.json({ error: 'refresh_token is required' }, 400)
    }

    const supabase = createSupabaseClient()
    const { data, error } = await supabase.auth.refreshSession({ refresh_token })

    if (error) return c.json({ error: error.message }, 401)

    return c.json({
        success: true,
        session: data.session,
        user: data.user,
    })
})

export default auth
