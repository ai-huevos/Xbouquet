import { getProducts, getCategories } from '@/lib/actions/products'
import MarketplaceProductCard from '@/components/products/MarketplaceProductCard'
import Link from 'next/link'

export const metadata = {
    title: 'Marketplace | Xpress Buke'
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function BrowsePage({
    searchParams
}: {
    searchParams: SearchParams
}) {
    const params = await searchParams
    const q = typeof params.q === 'string' ? params.q : ''
    const categoryId = typeof params.category === 'string' ? params.category : ''

    const [products, categories] = await Promise.all([
        getProducts(q, categoryId),
        getCategories()
    ])

    return (
        <div className="p-8 max-w-7xl mx-auto w-full">
            <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
                        Marketplace
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Discover fresh flowers from verified suppliers.
                    </p>
                </div>

                <form className="flex w-full flex-col gap-3 md:w-auto md:flex-row" action="/shop/browse">
                    <input
                        type="search"
                        name="q"
                        defaultValue={q}
                        placeholder="Search products..."
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition-colors focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 md:w-64"
                    />
                    <select
                        name="category"
                        defaultValue={categoryId}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition-colors focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 md:w-48 text-gray-700"
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <button type="submit" className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors">
                        Filter
                    </button>
                    {(q || categoryId) && (
                        <Link href="/shop/browse" className="flex items-center justify-center rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors">
                            Clear
                        </Link>
                    )}
                </form>
            </div>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50/50 py-32 text-center">
                    <div className="mb-4 rounded-full bg-gray-100 p-4 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No products found</h3>
                    <p className="mt-2 text-gray-500 max-w-sm">
                        {q || categoryId
                            ? "We couldn't find anything matching your filters. Try clearing them."
                            : "There are no active products available in the marketplace yet."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                        <MarketplaceProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}
