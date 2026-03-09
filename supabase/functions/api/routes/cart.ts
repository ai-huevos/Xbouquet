import { Hono } from 'https://deno.land/x/hono@v4.6.20/mod.ts'
import { authMiddleware } from '../middleware/auth.ts'

const cart = new Hono()

// All cart routes require auth — only shops use the cart
cart.use('*', authMiddleware)

cart.get('/', async (c) => {
    const supabase = c.get('supabase')
    const profile = c.get('profile')

    const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select(`
      id,
      quantity,
      product_id,
      product:flower_products (
        id,
        name,
        price_per_unit,
        stock_qty,
        image_url,
        supplier:supplier_profiles (
          profile_id,
          business_name
        )
      )
    `)
        .eq('shop_id', profile.id)

    if (error) return c.json({ items: [] }, 500)

    // Group by supplier
    const groupedCart: Record<string, {
        supplier: { profile_id: string; business_name: string }
        items: Array<{
            id: string
            quantity: number
            lineTotal: number
            product_id: string
            product: Record<string, unknown>
        }>
        subtotal: number
    }> = {}

    cartItems?.forEach((item: Record<string, unknown>) => {
        const prod = item.product as {
            id: string
            name: string
            price_per_unit: number
            stock_qty: number
            image_url: string | null
            supplier: { profile_id: string; business_name: string }
        }
        const supplierData = Array.isArray(prod.supplier) ? prod.supplier[0] : prod.supplier
        const supplierId = supplierData.profile_id

        if (!groupedCart[supplierId]) {
            groupedCart[supplierId] = { supplier: supplierData, items: [], subtotal: 0 }
        }

        const lineTotal = (item.quantity as number) * prod.price_per_unit
        groupedCart[supplierId].items.push({
            id: item.id as string,
            quantity: item.quantity as number,
            lineTotal,
            product_id: item.product_id as string,
            product: { ...prod, supplier: supplierData },
        })
        groupedCart[supplierId].subtotal += lineTotal
    })

    return c.json({
        grouped: Object.values(groupedCart),
        totalCount: cartItems?.reduce((acc: number, item: Record<string, unknown>) => acc + (item.quantity as number), 0) || 0,
        totalPrice: Object.values(groupedCart).reduce((acc, g) => acc + g.subtotal, 0),
    })
})

cart.post('/', async (c) => {
    const supabase = c.get('supabase')
    const profile = c.get('profile')
    const { productId, quantity } = await c.req.json()

    if (!productId || !quantity) {
        return c.json({ error: 'productId and quantity are required' }, 400)
    }

    // Check stock
    const { data: product } = await supabase
        .from('flower_products')
        .select('stock_qty')
        .eq('id', productId)
        .single()

    if (!product || product.stock_qty < quantity) {
        return c.json({ error: 'Not enough stock available' }, 400)
    }

    // Upsert logic
    const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('shop_id', profile.id)
        .eq('product_id', productId)
        .maybeSingle()

    if (existingItem) {
        const newQty = existingItem.quantity + quantity
        if (newQty > product.stock_qty) {
            return c.json({ error: 'Cannot add more than available stock' }, 400)
        }

        const { error } = await supabase
            .from('cart_items')
            .update({ quantity: newQty })
            .eq('id', existingItem.id)

        if (error) return c.json({ error: error.message }, 400)
    } else {
        const { error } = await supabase
            .from('cart_items')
            .insert({
                shop_id: profile.id,
                product_id: productId,
                quantity,
            })

        if (error) return c.json({ error: error.message }, 400)
    }

    return c.json({ success: true }, 201)
})

cart.put('/:id', async (c) => {
    const supabase = c.get('supabase')
    const cartItemId = c.req.param('id')
    const { quantity } = await c.req.json()

    // Get cart item to check product stock
    const { data: item } = await supabase
        .from('cart_items')
        .select('product_id')
        .eq('id', cartItemId)
        .single()

    if (!item) return c.json({ error: 'Item not found' }, 404)

    const { data: product } = await supabase
        .from('flower_products')
        .select('stock_qty')
        .eq('id', item.product_id)
        .single()

    if (!product || product.stock_qty < quantity) {
        return c.json({ error: 'Not enough stock available' }, 400)
    }

    const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)

    if (error) return c.json({ error: error.message }, 400)
    return c.json({ success: true })
})

cart.delete('/:id', async (c) => {
    const supabase = c.get('supabase')
    const cartItemId = c.req.param('id')

    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)

    if (error) return c.json({ error: error.message }, 400)
    return c.json({ success: true })
})

export default cart
