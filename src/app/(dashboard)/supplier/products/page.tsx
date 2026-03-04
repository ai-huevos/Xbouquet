import { getSupplierProducts } from '@/lib/actions/products'
import { ProductList } from '@/components/products/ProductList'
import Link from 'next/link'

export default async function SupplierProductsPage() {
    const products = await getSupplierProducts()

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Your Products</h1>
                    <p className="text-gray-400 mt-1">Manage your flower inventory on the marketplace.</p>
                </div>
                <Link
                    href="/supplier/products/new"
                    className="inline-flex items-center justify-center px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition shadow-lg shadow-purple-500/25 whitespace-nowrap"
                >
                    Add New Product
                </Link>
            </div>

            <ProductList products={products} />
        </div>
    )
}
