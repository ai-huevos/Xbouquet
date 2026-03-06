import { getSupplierProducts } from '@/lib/actions/products'
import { ProductList } from '@/components/products/ProductList'
import Link from 'next/link'

export default async function SupplierProductsPage() {
    const products = await getSupplierProducts()

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-enter p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Products</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your flower inventory on the marketplace.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
                    <Link
                        href="/supplier/products/import"
                        className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-foreground font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
                    >
                        Bulk Import CSV
                    </Link>
                    <Link
                        href="/supplier/products/new"
                        className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
                    >
                        Add New Product
                    </Link>
                </div>
            </div>

            <ProductList products={products} />
        </div>
    )
}
