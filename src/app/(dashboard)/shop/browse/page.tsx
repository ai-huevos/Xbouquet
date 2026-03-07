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
        <div className="max-w-[1440px] mx-auto flex gap-8 p-4 sm:p-6 lg:p-8 w-full animate-enter">
            {/* STITCH FACETED NAVIGATION SIDEBAR */}
            <aside className="w-64 shrink-0 space-y-8 hidden md:block">
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">Categories</h3>
                    <div className="space-y-1">
                        <Link href="/shop/browse" className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${!categoryId ? 'bg-primary-500/15 border-l-2 border-primary-500' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-5 h-5 ${!categoryId ? 'text-primary-500' : 'text-zinc-400 group-hover:text-primary-500'}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                </svg>
                                <span className="text-sm font-semibold">All Products</span>
                            </div>
                        </Link>
                        {categories.map((c) => {
                            const isActive = categoryId === c.id
                            return (
                                <Link key={c.id} href={`/shop/browse?category=${c.id}${q ? `&q=${q}` : ''}`} className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${isActive ? 'bg-primary-500/15 border-l-2 border-primary-500' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                                    <div className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-5 h-5 ${isActive ? 'text-primary-500' : 'text-zinc-400 group-hover:text-primary-500'}`}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a1.5 1.5 0 01-1.5 1.5H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V8.25c0-.621-.504-1.125-1.125-1.125H13.5m0 0h2.25m-2.25 0c.355 0 .676.186.959.401.29.221.634.349 1.003.349 1.036 0 1.875-1.007 1.875-2.25s-.84-2.25-1.875-2.25c-.369 0-.713.128-1.003.349-.283.215-.604.401-.959.401v0a1.5 1.5 0 01-1.5-1.5z" />
                                        </svg>
                                        <span className="text-sm font-medium">{c.name}</span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </section>
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">Availability</h3>
                    <div className="space-y-3 px-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input checked={true} readOnly className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 bg-transparent text-primary-500 focus:ring-primary-500 transition-all cursor-pointer" type="checkbox" />
                            <span className="text-sm group-hover:text-primary-500 transition-colors">In Stock Only</span>
                        </label>
                    </div>
                </section>
                <div className="p-4 bg-primary-500/10 rounded-xl border border-primary-500/20">
                    <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase mb-1">Premium Partner</p>
                    <p className="text-sm font-medium leading-snug">Get 15% off bulk orders over $2,500.</p>
                    <button className="mt-3 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 transition-colors px-3 py-1.5 rounded-lg w-full">Learn More</button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1">
                <div className="flex items-center gap-4 mb-4 lg:hidden">
                    {/* Mobile Filter Button */}
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>
                        Filters
                    </button>
                    {(q || categoryId) && (
                        <Link href="/shop/browse" className="text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                            Clear Filters
                        </Link>
                    )}
                </div>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight">
                            {categoryId ? categories.find(c => c.id === categoryId)?.name || 'Marketplace' : 'Bulk Floral Selection'}
                            {q ? ` - Search results for "${q}"` : ''}
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Showing {products.length} results for your floral business</p>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-lg text-sm font-semibold hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" /></svg>
                            Sort by: Best Match
                        </button>
                    </div>
                </div>

                {!categoryId && products.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-4">Featured Categories</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {categories.slice(0, 4).map((c) => (
                                <Link
                                    key={c.id}
                                    href={`/shop/browse?category=${c.id}`}
                                    className="group relative overflow-hidden rounded-2xl aspect-[2/1] bg-white/50 dark:bg-zinc-800/50 glass border border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-4 hover:ring-2 hover:ring-primary-500 hover:border-transparent transition-all shadow-sm"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent group-hover:opacity-100 opacity-0 transition-opacity"></div>
                                    <span className="relative z-10 font-bold text-foreground group-hover:scale-105 transition-transform text-center line-clamp-2">{c.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl glass-panel py-32 text-center">
                        <div className="mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 p-4 text-zinc-400 dark:text-zinc-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-foreground">No products found</h3>
                        <p className="mt-2 text-zinc-500 dark:text-zinc-400 max-w-sm">
                            {q || categoryId
                                ? "We couldn't find anything matching your filters. Try clearing them."
                                : "There are no active products available in the marketplace yet."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <MarketplaceProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
