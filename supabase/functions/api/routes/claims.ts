import { Hono } from 'https://deno.land/x/hono@v4.6.20/mod.ts'
import { authMiddleware } from '../middleware/auth.ts'

const claims = new Hono()

claims.use('*', authMiddleware)

// Create a claim (shop only)
claims.post('/', async (c) => {
    const supabase = c.get('supabase')
    const profile = c.get('profile')

    if (profile.role !== 'shop') {
        return c.json({ error: 'Only shops can create claims' }, 403)
    }

    const { order_item_id, reason, requested_credit_amount, description } = await c.req.json()

    if (!order_item_id || !reason || !description || !requested_credit_amount) {
        return c.json({ error: 'Missing required fields' }, 400)
    }

    // Verify the order item belongs to this shop
    const { data: orderItem, error: itemError } = await supabase
        .from('order_items')
        .select('order:orders ( shop_id, supplier_id )')
        .eq('id', order_item_id)
        .single()

    if (itemError || !orderItem || (orderItem.order as Record<string, unknown>).shop_id !== profile.id) {
        return c.json({ error: 'Invalid order item' }, 403)
    }

    const { error } = await supabase
        .from('claims')
        .insert({
            order_item_id,
            shop_id: profile.id,
            supplier_id: (orderItem.order as Record<string, unknown>).supplier_id,
            reason,
            requested_credit_amount: requested_credit_amount * 100, // convert to cents
            description,
            evidence_url_array: [],
            status: 'pending',
        })

    if (error) return c.json({ error: 'Failed to submit claim' }, 400)
    return c.json({ success: true }, 201)
})

// Update claim status (supplier only)
claims.put('/:id', async (c) => {
    const supabase = c.get('supabase')
    const profile = c.get('profile')
    const claimId = c.req.param('id')
    const { status, resolution_notes } = await c.req.json()

    if (!['approved', 'rejected'].includes(status)) {
        return c.json({ error: 'Status must be approved or rejected' }, 400)
    }

    // Verify claim belongs to this supplier
    const { data: claim } = await supabase
        .from('claims')
        .select('shop_id, requested_credit_amount, status, supplier_id')
        .eq('id', claimId)
        .single()

    if (!claim || claim.supplier_id !== profile.id) {
        return c.json({ error: 'Invalid claim or permission denied' }, 403)
    }

    if (claim.status !== 'pending') {
        return c.json({ error: 'Claim is already ' + claim.status }, 400)
    }

    const { error } = await supabase
        .from('claims')
        .update({
            status,
            resolution_notes,
            updated_at: new Date().toISOString(),
        })
        .eq('id', claimId)

    if (error) return c.json({ error: 'Failed to update claim' }, 500)

    // If approved, credit the shop's balance
    if (status === 'approved') {
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

    return c.json({ success: true })
})

export default claims
