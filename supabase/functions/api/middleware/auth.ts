import { Context, Next } from 'hono'
import { createSupabaseClient } from '../lib/supabase.ts'

/**
 * Auth Middleware — validates Supabase JWT and attaches user + profile to context.
 * 
 * After this middleware runs, handlers can access:
 *   c.get('user')     → Supabase auth user
 *   c.get('profile')  → { id, role, full_name } from profiles table
 *   c.get('supabase') → Supabase client scoped to this user
 */
export async function authMiddleware(c: Context, next: Next) {
    const authHeader = c.req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Missing or invalid Authorization header' }, 401)
    }

    const supabase = createSupabaseClient(authHeader)
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return c.json({ error: 'Invalid or expired token' }, 401)
    }

    // Fetch profile (needed for most operations)
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, role, full_name')
        .eq('user_id', user.id)
        .single()

    if (!profile) {
        return c.json({ error: 'Profile not found' }, 404)
    }

    // Attach to context
    c.set('user', user)
    c.set('profile', profile)
    c.set('supabase', supabase)

    await next()
}

/**
 * Optional auth — attaches user if present but doesn't block.
 * Use for public endpoints that optionally personalize for logged-in users.
 */
export async function optionalAuth(c: Context, next: Next) {
    const authHeader = c.req.header('Authorization')

    if (authHeader?.startsWith('Bearer ')) {
        const supabase = createSupabaseClient(authHeader)
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('id, role, full_name')
                .eq('user_id', user.id)
                .single()

            c.set('user', user)
            c.set('profile', profile)
            c.set('supabase', supabase)
        }
    }

    // Always proceed — auth is optional
    if (!c.get('supabase')) {
        c.set('supabase', createSupabaseClient())
    }

    await next()
}
