/* eslint-disable @typescript-eslint/no-explicit-any */
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
        <div className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col overflow-x-hidden bg-background-light dark:bg-zinc-950 font-display text-slate-900 dark:text-slate-100 pb-40">
            {/* Main Content */}
            <main className="flex-1 px-4 sm:px-6 py-6 space-y-6 max-w-3xl mx-auto w-full">
                {!cart.totalCount || cart.totalCount === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl glass-light py-32 text-center animate-enter">
                        <div className="mb-4 rounded-full bg-primary-600/10 p-6 text-primary-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Your cart is empty</h3>
                        <p className="mt-2 text-zinc-500 dark:text-zinc-400 max-w-sm">Looks like you haven&apos;t added any flowers to your cart yet.</p>
                        <Link href="/shop/browse" className="mt-8 rounded-xl bg-primary-600 px-8 py-3.5 font-bold text-white transition-all hover:bg-primary-700 active:scale-95 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                            Browse Marketplace
                        </Link>
                    </div>
                ) : (
                    <>
                        <section className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-primary-500">Items in Order ({cart.totalCount ?? 0})</h2>
                                <span className="text-xs text-slate-400">Inventory Reserved</span>
                            </div>

                            {cart.grouped?.map((group: any) => (
                                <div key={group.supplier.profile_id} className="space-y-4">
                                    <div className="flex items-center gap-2 px-2 pb-2 border-b border-primary-500/10">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                                        <span className="text-sm font-bold text-slate-300">{group.supplier.business_name}</span>
                                    </div>

                                    {group.items?.map((item: any) => (
                                        <div key={item.id} className="glass-light rounded-xl p-4 flex gap-4 items-center">
                                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-800/50">
                                                {item.product.image_url ? (
                                                    <Image src={item.product.image_url} alt={item.product.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700/50">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-zinc-400 dark:text-zinc-600">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-between h-20">
                                                <h3 className="text-sm font-semibold text-slate-100 truncate">{item.product.name}</h3>
                                                <p className="text-xs text-slate-400 -mt-1">Unit Price: ${(item.product.price_per_unit / 100).toFixed(2)} / stem</p>
                                                {(item.product.box_type || item.product.stems_per_bunch) && (
                                                    <p className="text-[10px] text-primary-400 font-medium">
                                                        {item.product.box_type ? `Box: ${item.product.box_type}` : ''}
                                                        {item.product.box_type && item.product.stems_per_bunch ? ' | ' : ''}
                                                        {item.product.stems_per_bunch ? `${item.product.stems_per_bunch} stems/bunch` : ''}
                                                    </p>
                                                )}
                                                <div className="flex items-end justify-between mt-auto">
                                                    <div className="scale-90 origin-left">
                                                        <CartItemControls itemId={item.id} quantity={item.quantity} maxStock={item.product.stock_qty} />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-100">${(item.lineTotal / 100).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </section>

                        {/* Shipping Calculator */}
                        <section className="glass-light rounded-xl p-4 border-l-4 border-primary-600 mt-8 hidden sm:block">
                            <div className="flex items-center gap-3 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                <h3 className="text-sm font-semibold text-slate-100">Shipping Calculator</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="relative flex gap-2">
                                    <div className="w-1/2">
                                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 ml-1">State</label>
                                        <input className="w-full bg-zinc-900/50 border border-slate-700/50 rounded-lg text-sm py-2 px-3 text-slate-100 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" type="text" placeholder="NY" />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 ml-1">Destination Zip</label>
                                        <input className="w-full bg-zinc-900/50 border border-slate-700/50 rounded-lg text-sm py-2 px-3 text-slate-100 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" type="text" placeholder="10001" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                                    <span>Standard Cold-Chain Delivery</span>
                                    <span className="text-primary-500 font-semibold">Free Over $500</span>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </main>

            {/* Bottom Fixed Summary (Only when cart is not empty) */}
            {(cart.totalCount ?? 0) > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-[100] md:relative md:max-w-3xl md:mx-auto md:w-full md:pb-6">
                    <div className="glass px-4 sm:px-6 py-4 sm:py-6 rounded-t-[2rem] md:rounded-2xl shadow-2xl space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Subtotal</span>
                                <span className="text-slate-100 font-medium">${((cart.totalPrice ?? 0) / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Estimated Tax (B2B)</span>
                                <span className="text-slate-100 font-medium">$0.00</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Shipping Fee</span>
                                <span className="text-primary-500 font-bold uppercase text-[10px]">Calculated at next step</span>
                            </div>
                            <div className="h-[1px] bg-slate-700/50 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-base font-bold text-slate-100">Total Amount</span>
                                <span className="text-xl font-bold text-slate-100">${((cart.totalPrice ?? 0) / 100).toFixed(2)}</span>
                            </div>
                        </div>
                        <Link href="/checkout/gateway" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                            <span>Proceed to Checkout</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
