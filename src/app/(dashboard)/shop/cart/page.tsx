import { getCart } from '@/lib/actions/cart'
import CartItemControls from '@/components/cart/CartItemControls'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
    title: 'Your Cart | Xpress Buke'
}

export default async function CartPage() {
    const cart = await getCart()

    return (
        <div className="bg-background-light dark:bg-zinc-950 font-display min-h-screen">
            <main className="max-w-7xl mx-auto px-6 py-12 pb-32">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 mb-8 pt-4">
                    <Link href="/shop/browse" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Marketplace</Link>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-slate-900 dark:text-slate-100 font-medium">Checkout Selection</span>
                </nav>

                {!cart.totalCount || cart.totalCount === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/40 dark:border-zinc-800/50 py-32 text-center animate-enter shadow-xl">
                        <div className="mb-4 rounded-full bg-primary-600/10 p-6 text-primary-500">
                            <span className="material-symbols-outlined text-4xl">shopping_cart</span>
                        </div>
                        <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Your Selection is Empty</h3>
                        <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-sm">Looks like you haven&apos;t added any premium floral cultivars to your cart yet.</p>
                        <Link href="/shop/browse" className="mt-8 rounded-xl bg-primary-600 px-8 py-3.5 font-bold text-white transition-all hover:bg-primary-700 active:scale-95 shadow-lg shadow-primary-500/20 hover:-translate-y-0.5">
                            Browse Inventory
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        {/* Left Column: Cart Items */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="flex items-baseline justify-between mb-2">
                                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Your Selection</h2>
                                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{cart.totalCount} Stems/Bunches Reserved</span>
                            </div>

                            {cart.grouped?.map((group: any) => (
                                <section key={group.supplier.profile_id} className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/40 dark:border-zinc-800/50 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl shadow-slate-200/50 dark:shadow-black/50">
                                    <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-zinc-800/50">
                                        <span className="material-symbols-outlined text-primary-600 dark:text-primary-400">potted_plant</span>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">{group.supplier.business_name}</h3>
                                        <span className="ml-auto text-xs font-bold uppercase tracking-wider text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 px-3 py-1 rounded">Preferred Partner</span>
                                    </div>

                                    <div className="space-y-6">
                                        {group.items?.map((item: any) => (
                                            <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pb-6 border-b border-slate-100 dark:border-zinc-800/30 last:border-0 last:pb-0">
                                                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/50 dark:bg-zinc-800/50 border border-white dark:border-zinc-700 shrink-0 relative">
                                                    {item.product.image_url ? (
                                                        <Image src={item.product.image_url} alt={item.product.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-zinc-800">
                                                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-3xl">image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 w-full">
                                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
                                                        <div>
                                                            <Link href={`/shop/browse/${item.product.id}`} className="hover:underline hover:text-primary-600">
                                                                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{item.product.name}</h4>
                                                            </Link>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                                {(item.product.box_type || item.product.stems_per_bunch) && (
                                                                    <>
                                                                        {item.product.box_type ? `Box: ${item.product.box_type}` : ''}
                                                                        {item.product.box_type && item.product.stems_per_bunch ? ' • ' : ''}
                                                                        {item.product.stems_per_bunch ? `${item.product.stems_per_bunch} stems/bunch` : ''}
                                                                    </>
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0">
                                                            <p className="text-lg font-extrabold text-primary-600 dark:text-primary-400">${(item.lineTotal / 100).toFixed(2)}</p>
                                                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 inline-block">${(item.product.price_per_unit / 100).toFixed(2)} / unit</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-4">
                                                        <div className="scale-[0.85] sm:scale-95 origin-left">
                                                            <CartItemControls itemId={item.id} quantity={item.quantity} maxStock={item.product.stock_qty} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>

                        {/* Right Column: Order Summary (Sticky) */}
                        <div className="lg:col-span-4">
                            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/60 dark:border-zinc-700/50 rounded-3xl p-6 lg:p-8 sticky top-28 space-y-8 shadow-2xl shadow-primary-900/5 dark:shadow-black/70">
                                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight border-b border-slate-200 dark:border-zinc-700/50 pb-4">Order Summary</h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
                                        <span className="font-medium">Subtotal</span>
                                        <span className="font-bold text-slate-900 dark:text-slate-100">${((cart.totalPrice ?? 0) / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
                                        <span className="font-medium group relative cursor-help border-b border-slate-300 dark:border-zinc-600 border-dashed">
                                            B2B Tax Exemption
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-xs rounded p-2 pointer-events-none">Requires valid reseller certificate on file.</span>
                                        </span>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-500">-$0.00</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
                                        <span className="font-medium">Cold-Chain Shipping</span>
                                        <span className="font-bold text-primary-600 dark:text-primary-400">Calculated Later</span>
                                    </div>
                                    <div className="pt-4 border-t border-slate-200 dark:border-zinc-700/50 flex justify-between items-baseline">
                                        <span className="text-xl font-bold text-slate-900 dark:text-slate-100">Total Due</span>
                                        <span className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">${((cart.totalPrice ?? 0) / 100).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <div className="bg-primary-50/50 dark:bg-primary-900/10 rounded-2xl p-4 border border-primary-100 dark:border-primary-800/30">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="material-symbols-outlined text-primary-600 dark:text-primary-400 text-sm">local_shipping</span>
                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Delivery Logistics</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Guaranteed temperature-controlled delivery. All flowers are shipped in hydration reservoir boxes to preserve Stage 2 bloom cycle.</p>
                                    </div>

                                    <Link href="/checkout/gateway" className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] group">
                                        <span>Secure Checkout</span>
                                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </Link>

                                    <div className="flex items-center justify-center gap-6 pt-4">
                                        <div className="flex items-center gap-1.5 grayscale opacity-50 dark:opacity-30">
                                            <span className="material-symbols-outlined text-sm">verified_user</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">256-bit SSL</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 grayscale opacity-50 dark:opacity-30">
                                            <span className="material-symbols-outlined text-sm">payments</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">Credit Terms</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
