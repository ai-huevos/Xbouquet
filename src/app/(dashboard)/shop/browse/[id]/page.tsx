import { getProduct } from '@/lib/actions/products'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { AddToCartForm } from '@/components/cart/AddToCartForm'

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }) {
    const resolvedParams = await params
    const product = await getProduct(resolvedParams.id)
    if (!product) return { title: 'Product Not Found | Xpress Buke' }
    return { title: `${product.name} | Xpress Buke` }
}

export default async function ProductDetailPage({
    params
}: {
    params: Params
}) {
    const resolvedParams = await params
    const product = await getProduct(resolvedParams.id)

    if (!product) {
        notFound()
    }

    return (
        <div className="bg-background-light dark:bg-zinc-950 font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen">
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-20 py-10 pb-32">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm font-medium text-slate-400 dark:text-slate-500 mb-8 pt-4">
                    <Link href="/shop/browse" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Marketplace</Link>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-slate-900 dark:text-slate-200">{product.name}</span>
                </nav>

                {/* Product Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Section: Image Gallery */}
                    <div className="space-y-4">
                        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/40 dark:border-zinc-800/50 p-3 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50">
                            <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                                {product.image_url ? (
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-zinc-700">image</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Product Details */}
                    <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/40 dark:border-zinc-800/50 p-8 lg:p-14 rounded-3xl shadow-2xl shadow-slate-200/40 dark:shadow-black/60">
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold tracking-widest text-primary-600 dark:text-primary-400 uppercase">
                                        {product.category?.name || 'Premium Select'}
                                    </span>
                                    <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-800/30">
                                        <span className="material-symbols-outlined text-sm">inventory_2</span>
                                        {product.stock_qty > 0 ? `${product.stock_qty} In Stock` : 'Out of Stock'}
                                    </div>
                                </div>
                                <h2 className="font-serif text-4xl lg:text-5xl text-slate-900 dark:text-white leading-tight mb-2">
                                    {product.name}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">
                                    Supplier: <span className="text-primary-600 dark:text-primary-400 font-bold">{product.supplier?.business_name || 'Verified Partner'}</span>
                                </p>
                            </div>

                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-extrabold text-primary-600 dark:text-primary-400">
                                    ${(product.price_per_unit / 100).toFixed(2)}
                                </span>
                                <span className="text-slate-400 dark:text-slate-500 font-medium">/ stem</span>
                                <span className="ml-4 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Min. 20 stems</span>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Description</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light text-lg">
                                    {product.description || 'The quintessential premium bloom. Known for delicate fragrance, exceptional vase life, and gold standard for high-end wedding installations and luxury floral arrangements.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-200 dark:border-zinc-800/50">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">Grade</p>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">A1 Premium</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">Stem Length</p>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">60cm - 75cm</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">Season</p>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Year-Round</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">Origin</p>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Direct Farm</p>
                                </div>
                            </div>

                            <AddToCartForm productId={product.id} stockQty={product.stock_qty} minOrder={20} />

                            <div className="flex items-center justify-center gap-8 pt-4">
                                <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    <span className="material-symbols-outlined text-lg">favorite</span>
                                    SAVE TO WISHLIST
                                </button>
                                <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    <span className="material-symbols-outlined text-lg">share</span>
                                    SHARE PRODUCT
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
