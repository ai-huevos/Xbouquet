import { Hono } from 'https://deno.land/x/hono@v4.6.20/mod.ts'
import { authMiddleware, optionalAuth } from '../middleware/auth.ts'

const products = new Hono()

// ── Public routes (optional auth) ────────────────────────────────────

products.get('/categories', optionalAuth, async (c) => {
    const supabase = c.get('supabase')
    const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name')

    if (error) return c.json({ error: error.message }, 500)
    return c.json(data)
})

products.get('/', optionalAuth, async (c) => {
    const supabase = c.get('supabase')
    const search = c.req.query('search')
    const categoryId = c.req.query('category')

    let query = supabase
        .from('flower_products')
        .select(`
      *,
      category:product_categories(*),
      supplier:supplier_profiles(*)
    `)
        .gt('stock_qty', 0)
        .order('created_at', { ascending: false })

    if (search) query = query.ilike('name', `%${search}%`)
    if (categoryId) query = query.eq('category_id', categoryId)

    const { data, error } = await query
    if (error) return c.json({ error: error.message }, 500)
    return c.json(data)
})

products.get('/:id', optionalAuth, async (c) => {
    const supabase = c.get('supabase')
    const id = c.req.param('id')

    const { data, error } = await supabase
        .from('flower_products')
        .select(`
      *,
      category:product_categories(*),
      supplier:supplier_profiles(*)
    `)
        .eq('id', id)
        .single()

    if (error) return c.json({ error: 'Product not found' }, 404)
    return c.json(data)
})

// ── Authenticated routes ─────────────────────────────────────────────

products.get('/mine', authMiddleware, async (c) => {
    const supabase = c.get('supabase')
    const profile = c.get('profile')

    const { data, error } = await supabase
        .from('flower_products')
        .select(`
      *,
      category:product_categories(*)
    `)
        .eq('supplier_id', profile.id)
        .order('created_at', { ascending: false })

    if (error) return c.json({ error: error.message }, 500)
    return c.json(data)
})

products.post('/', authMiddleware, async (c) => {
    const profile = c.get('profile')
    if (profile.role !== 'supplier') {
        return c.json({ error: 'Only suppliers can create products' }, 403)
    }

    const supabase = c.get('supabase')
    const body = await c.req.json()

    const { error } = await supabase
        .from('flower_products')
        .insert({
            supplier_id: profile.id,
            ...body,
        })

    if (error) return c.json({ error: error.message }, 400)
    return c.json({ success: true }, 201)
})

products.post('/bulk', authMiddleware, async (c) => {
    const profile = c.get('profile')
    if (profile.role !== 'supplier') {
        return c.json({ error: 'Only suppliers can create products' }, 403)
    }

    const supabase = c.get('supabase')
    const { products: items } = await c.req.json()

    if (!Array.isArray(items) || items.length === 0) {
        return c.json({ error: 'No products provided' }, 400)
    }

    const validProducts = items.map((item: Record<string, unknown>) => ({
        supplier_id: profile.id,
        ...item,
    }))

    const { error } = await supabase
        .from('flower_products')
        .insert(validProducts)

    if (error) return c.json({ error: error.message }, 400)
    return c.json({ success: true, insertedCount: validProducts.length }, 201)
})

products.put('/:id', authMiddleware, async (c) => {
    const supabase = c.get('supabase')
    const id = c.req.param('id')
    const body = await c.req.json()

    const { error } = await supabase
        .from('flower_products')
        .update(body)
        .eq('id', id)

    if (error) return c.json({ error: error.message }, 400)
    return c.json({ success: true })
})

products.delete('/:id', authMiddleware, async (c) => {
    const supabase = c.get('supabase')
    const id = c.req.param('id')

    const { error } = await supabase
        .from('flower_products')
        .delete()
        .eq('id', id)

    if (error) return c.json({ error: error.message }, 400)
    return c.json({ success: true })
})

products.post('/image', authMiddleware, async (c) => {
    const user = c.get('user')
    const supabase = c.get('supabase')

    const formData = await c.req.formData()
    const file = formData.get('image') as File | null

    if (!file) return c.json({ error: 'No file provided' }, 400)

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`

    const { error } = await supabase.storage
        .from('product_images')
        .upload(fileName, file)

    if (error) return c.json({ error: error.message }, 500)

    const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(fileName)

    return c.json({ success: true, url: publicUrl })
})

export default products
