'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addToCart(productId: string, quantity: number) {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
        console.error("addToCart: Not authenticated", userError)
        return { error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

    if (!profile) {
        console.error("addToCart: Profile not found for User:", userData.user.id)
        return { error: 'Profile not found' }
    }

    // Check stock
    const { data: product } = await supabase
        .from('flower_products')
        .select('stock_qty')
        .eq('id', productId)
        .single()

    if (!product || product.stock_qty < quantity) {
        return { error: 'Not enough stock available' }
    }

    // Upsert logic - if item exists on the unique constraint (shop_id, product_id), we want to add to it or just rely on the user to use updateCartItem.
    // Given the unique constraint, handling it manually:
    const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('shop_id', profile.id)
        .eq('product_id', productId)
        .maybeSingle()

    if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        if (newQty > product.stock_qty) return { error: 'Cannot add more than available stock' }

        const { error: updateError } = await supabase
            .from('cart_items')
            .update({ quantity: newQty })
            .eq('id', existingItem.id)

        if (updateError) {
            console.error("addToCart: updateError", updateError)
            return { error: updateError.message }
        }
    } else {
        const { error: insertError } = await supabase
            .from('cart_items')
            .insert({
                shop_id: profile.id,
                product_id: productId,
                quantity
            })

        if (insertError) {
            console.error("addToCart: insertError against shop_id", profile.id, insertError)
            return { error: insertError.message }
        }
    }

    console.log("addToCart: Successfully added to cart. Revalidating...")

    revalidatePath('/shop/cart')
    revalidatePath('/shop/browse')
    return { success: true }
}

export async function updateCartItem(cartItemId: string, quantity: number) {
    const supabase = await createClient()

    // Validate auth implicitly via RLS but explicitly get user to fetch profile if needed, or rely solely on RLS.
    // To check stock, we need the product details.

    // First get the cart item to find the product
    const { data: item } = await supabase
        .from('cart_items')
        .select('product_id, quantity')
        .eq('id', cartItemId)
        .single()

    if (!item) return { error: 'Item not found' }

    // Check stock
    const { data: product } = await supabase
        .from('flower_products')
        .select('stock_qty')
        .eq('id', item.product_id)
        .single()

    if (!product || product.stock_qty < quantity) {
        return { error: 'Not enough stock available' }
    }

    const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)

    if (error) return { error: error.message }

    revalidatePath('/shop/cart')
    return { success: true }
}

export async function removeFromCart(cartItemId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)

    if (error) return { error: error.message }

    revalidatePath('/shop/cart')
    return { success: true }
}

export async function getCart() {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) return { items: [] }

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

    if (!profile) return { items: [] }

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

    if (error) {
        console.error('Error fetching cart:', error)
        return { items: [] }
    }

    // Group by supplier
    const groupedCart: Record<string, {
        supplier: { profile_id: string; business_name: string };
        items: Array<{
            id: string;
            quantity: number;
            lineTotal: number;
            product_id: string;
            product: {
                id: string;
                name: string;
                price_per_unit: number;
                stock_qty: number;
                image_url: string | null;
                supplier: {
                    profile_id: string;
                    business_name: string;
                };
            }
        }>;
        subtotal: number;
    }> = {}

    cartItems?.forEach(item => {
        const prod = item.product as unknown as {
            id: string;
            name: string;
            price_per_unit: number;
            stock_qty: number;
            image_url: string | null;
            supplier: { profile_id: string; business_name: string }
        }
        const supplierId = prod.supplier.profile_id

        if (!groupedCart[supplierId]) {
            groupedCart[supplierId] = {
                supplier: prod.supplier,
                items: [],
                subtotal: 0
            }
        }

        const lineTotal = item.quantity * prod.price_per_unit

        const supplierData = Array.isArray(prod.supplier) ? prod.supplier[0] : prod.supplier
        groupedCart[supplierId].items.push({
            id: item.id,
            quantity: item.quantity,
            lineTotal,
            product_id: item.product_id,
            product: {
                id: prod.id,
                name: prod.name,
                price_per_unit: prod.price_per_unit,
                stock_qty: prod.stock_qty,
                image_url: prod.image_url,
                supplier: supplierData
            }
        })
        groupedCart[supplierId].subtotal += lineTotal
    })

    return {
        grouped: Object.values(groupedCart),
        totalCount: cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0,
        totalPrice: Object.values(groupedCart).reduce((acc: number, group: unknown) => acc + (group as { subtotal: number }).subtotal, 0)
    }
}
