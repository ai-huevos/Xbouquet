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
            {/* Sticky Header */}
            <header className="fixed top-0 z-50 w-full glass">
                <div className="flex items-center justify-between p-4 h-16 max-w-md mx-auto">
                    <Link href="/shop/browse" className="text-slate-100 hover:text-primary-500 transition-colors p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </Link>
                    <div className="flex-1 px-4">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            </span>
                            <input
                                className="w-full bg-slate-800/50 border-none rounded-full py-1.5 pl-9 pr-4 text-xs focus:ring-1 focus:ring-primary-500 text-slate-200 placeholder-slate-500 outline-none"
                                placeholder="Search marketplace..."
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/shop/cart" className="relative text-slate-100 p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto pb-32">
                {/* Hero Image */}
                <div className="relative w-full aspect-[4/5] mt-0 overflow-hidden bg-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
                    {product.image_url ? (
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 text-zinc-400 dark:text-zinc-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                        </div>
                    )}
                    <div className="absolute bottom-6 left-4 z-20">
                        <span className="bg-primary-600/20 text-primary-400 border border-primary-500/30 text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded mb-2 inline-block">
                            {product.category?.name || 'Uncategorized'}
                        </span>
                        <h1 className="text-3xl font-bold text-white leading-tight">{product.name}</h1>
                    </div>
                </div>

                {/* Supplier Info */}
                <div className="px-4 py-6">
                    <div className="flex items-center justify-between glass-light p-4 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-500/30 bg-zinc-800 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    <p className="text-slate-100 font-bold">{product.supplier?.business_name || 'Unknown Supplier'}</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><path d="m9 12 2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
                                </div>
                                <p className="text-slate-400 text-xs">Verified Partner</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center justify-end text-yellow-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                <span className="text-sm font-bold ml-1 text-slate-100">4.8</span>
                            </div>
                            <p className="text-slate-500 text-[10px]">(1.2k Reviews)</p>
                        </div>
                    </div>
                </div>

                {/* Conversational Attributes */}
                <div className="px-4 mb-8">
                    <h3 className="text-primary-500 text-xs font-bold uppercase tracking-widest mb-4">Market Specifications</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="glass-light p-3 rounded-lg flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500 mt-0.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase">Vase Life</p>
                                <p className="text-sm font-medium">10-14 days</p>
                            </div>
                        </div>
                        <div className="glass-light p-3 rounded-lg flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500 mt-0.5"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase">Bloom Stage</p>
                                <p className="text-sm font-medium">Stage 2</p>
                            </div>
                        </div>
                        <div className="glass-light p-3 rounded-lg flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500 mt-0.5"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" /></svg>
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase">Stem Length</p>
                                <p className="text-sm font-medium">50-60cm</p>
                            </div>
                        </div>
                        <div className="glass-light p-3 rounded-lg flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500 mt-0.5"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase">Availability</p>
                                {product.stock_qty > 0 ? (
                                    <p className="text-sm font-medium text-primary-400">{product.stock_qty} in stock</p>
                                ) : (
                                    <p className="text-sm font-medium text-red-500">Out of stock</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Tiers (Just one main one for now to match db) */}
                <div className="px-4 mb-8">
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-slate-100 text-lg font-bold">Wholesale Pricing</h3>
                        <span className="text-slate-400 text-xs">Price per stem</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-4 glass-light rounded-xl border-l-4 border-l-primary-500">
                            <div>
                                <p className="text-sm font-bold text-slate-100">{product.stock_qty > 0 ? 'Available Stock' : 'Out of Stock'}</p>
                                <p className="text-xs text-slate-500">Standard Tier</p>
                            </div>
                            <p className="text-xl font-bold text-primary-500">${(product.price_per_unit / 100).toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="px-4 mb-12">
                    <h3 className="text-slate-100 font-bold mb-3">Product Description</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {product.description || 'No detailed description available for this product.'}
                    </p>
                </div>
            </main>

            <AddToCartForm productId={product.id} stockQty={product.stock_qty} minOrder={1} />
        </div>
    )
}
