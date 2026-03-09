import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.98.0'

/**
 * Create a Supabase client scoped to the requesting user's JWT.
 * This is the Edge Function equivalent of src/lib/supabase/server.ts
 */
export function createSupabaseClient(authHeader?: string) {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: authHeader ? { Authorization: authHeader } : {},
        },
    })
}

/**
 * Admin client — bypasses RLS. Use only for operations that need it
 * (e.g., checking data across users for validation).
 */
export function createAdminClient() {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    return createClient(supabaseUrl, serviceRoleKey)
}
