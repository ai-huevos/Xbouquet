import { getCategories, getProduct } from '@/lib/actions/products'
import { ProductForm } from '@/components/products/ProductForm'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditProductPage({ params }: PageProps) {
    const { id } = await params

    const [categories, product] = await Promise.all([
        getCategories(),
        getProduct(id)
    ])

    if (!product) {
        notFound()
    }

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

            <ProductForm categories={categories} initialData={product} />
        </div>
    )
}
