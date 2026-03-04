import { getCategories } from '@/lib/actions/products'
import { ProductForm } from '@/components/products/ProductForm'
import Link from 'next/link'

export default async function NewProductPage() {
    const categories = await getCategories()

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/supplier/products"
                    className="text-sm text-purple-400 hover:text-purple-300 transition"
                >
                    &larr; Back to Products
                </Link>
            </div>

            <ProductForm categories={categories} />
        </div>
    )
}
