'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { productSchema, ProductFormValues } from '../validators/products'
import { bulkProductSchema, BulkProductFormValues } from '../validators/import'
import { FlowerProduct, FlowerProductWithCategory, FlowerProductWithSupplier, ProductCategory } from '@/types/products'

export async function getCategories(): Promise<ProductCategory[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name')

    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }

    return data as ProductCategory[]
}

export async function getSupplierProducts(): Promise<FlowerProductWithCategory[]> {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) return []

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

    if (!profile) return []

    const { data: products, error: productsError } = await supabase
        .from('flower_products')
        .select(`
      *,
      category:product_categories(*)
    `)
        .eq('supplier_id', profile.id)
        .order('created_at', { ascending: false })

    if (productsError) {
        console.error('Error fetching products:', productsError)
        return []
    }

    return products as unknown as FlowerProductWithCategory[]
}

export async function getProducts(search?: string, categoryId?: string): Promise<FlowerProductWithSupplier[]> {
    const supabase = await createClient()

    let query = supabase
        .from('flower_products')
        .select(`
      *,
      category:product_categories(*),
      supplier:supplier_profiles(*)
    `)
        .gt('stock_qty', 0)
        .order('created_at', { ascending: false })

    if (search) {
        query = query.ilike('name', `%${search}%`)
    }

    if (categoryId) {
        query = query.eq('category_id', categoryId)
    }

    const { data: products, error } = await query

    if (error) {
        console.error('Error fetching marketplace products:', error)
        return []
    }

    return products as unknown as FlowerProductWithSupplier[]
}

export async function getProduct(id: string): Promise<FlowerProductWithSupplier | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('flower_products')
        .select(`
      *,
      category:product_categories(*),
      supplier:supplier_profiles(*)
    `)
        .eq('id', id)
        .single()

    if (error) return null
    return data as unknown as FlowerProductWithSupplier
}

export async function createProduct(values: ProductFormValues) {
    console.log('[DEBUG] createProduct called with:', values)
    const parsed = productSchema.safeParse(values)
    if (!parsed.success) {
        console.error('[DEBUG] createProduct validation failed:', parsed.error)
        return { error: 'Invalid product data' }
    }

    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) return { error: 'Not authenticated' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

    if (!profile) return { error: 'Profile not found' }

    const { error } = await supabase
        .from('flower_products')
        .insert({
            supplier_id: profile.id,
            ...parsed.data
        })

    if (error) {
        console.error('Error creating product:', error)
        return { error: error.message }
    }

    revalidatePath('/supplier/products')
    revalidatePath('/shop/browse')
    return { success: true }
}

export async function bulkCreateProducts(products: BulkProductFormValues[]) {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) return { error: 'Not authenticated' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

    if (!profile) return { error: 'Profile not found' }

    // Validate all products
    const validProducts = [];
    const errors = [];

    for (let i = 0; i < products.length; i++) {
        const parsed = bulkProductSchema.safeParse(products[i]);

        if (parsed.success) {
            validProducts.push({
                supplier_id: profile.id,
                ...parsed.data
            });
        } else {
            errors.push(`Row ${i + 1}: ${parsed.error.issues.map((e: { message: string }) => e.message).join(', ')}`);
        }
    }

    if (validProducts.length === 0) {
        return { error: 'No valid products to insert. Errors: ' + errors.join('; ') };
    }

    const { error } = await supabase
        .from('flower_products')
        .insert(validProducts)

    if (error) {
        console.error('Error in bulk insert:', error)
        return { error: error.message }
    }

    revalidatePath('/supplier/products')
    return {
        success: true,
        insertedCount: validProducts.length,
        errors: errors.length > 0 ? errors : undefined
    }
}


export async function updateProduct(id: string, values: ProductFormValues) {
    const parsed = productSchema.safeParse(values)
    if (!parsed.success) {
        return { error: 'Invalid product data' }
    }

    const supabase = await createClient()

    // RLS will ensure they can only update their own
    const { error } = await supabase
        .from('flower_products')
        .update(parsed.data)
        .eq('id', id)

    if (error) {
        console.error('Error updating product:', error)
        return { error: error.message }
    }

    revalidatePath('/supplier/products')
    revalidatePath('/shop/browse')
    return { success: true }
}

export async function deleteProduct(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('flower_products')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting product:', error)
        return { error: error.message }
    }

    revalidatePath('/supplier/products')
    revalidatePath('/shop/browse')
    return { success: true }
}

export async function uploadProductImage(formData: FormData) {
    const file = formData.get('image') as File | null
    if (!file) return { error: 'No file provided' }

    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) return { error: 'Unauthorized' }

    const fileExt = file.name.split('.').pop()
    const fileName = `${userData.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`

    const { data, error } = await supabase.storage
        .from('product_images')
        .upload(fileName, file)

    if (error) {
        console.error('Error uploading image:', error)
        return { error: error.message }
    }

    const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(fileName)

    return { success: true, url: publicUrl }
}
