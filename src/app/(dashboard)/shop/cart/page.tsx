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
        <div className="min-h-screen bg-background p-6 md:p-12 relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-500/10 dark:bg-primary-900/20 blur-[120px] rounded-full point-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-primary-300/10 dark:bg-primary-800/20 blur-[120px] rounded-full point-events-none" />
            <div className="mx-auto max-w-5xl relative z-10 animate-enter">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                            Your Cart
                        </h1>
                        <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
                            {cart.totalCount} {cart.totalCount === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>
                    {cart.totalCount && cart.totalCount > 0 && (
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Cart Total</p>
                            <p className="text-3xl font-black text-foreground">
                                ${(cart.totalPrice / 100).toFixed(2)}
                            </p>
                        </div>
                    )}
                </div>

                {!cart.totalCount || cart.totalCount === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl glass-panel py-32 text-center animate-enter">
                        <div className="mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800/50 p-6 text-zinc-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Your cart is empty</h3>
                        <p className="mt-2 text-zinc-500 dark:text-zinc-400 max-w-sm">
                            Looks like you haven&apos;t added any flowers to your cart yet.
                        </p>
                        <Link
                            href="/shop/browse"
                            className="mt-8 rounded-xl bg-primary-600 px-8 py-3.5 font-semibold text-white transition-all hover:bg-primary-700 active:scale-95 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                            Browse Marketplace
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-6">
                            {cart.grouped?.map((group: {
                                supplier: { profile_id: string; business_name: string };
                                items: Array<{
                                    id: string;
                                    quantity: number;
                                    lineTotal: number;
                                    product_id: string;
                                    product: {
                                        id: string;
                                        name: string;
                                        price_per_unit: number;
                                        stock_qty: number;
                                        image_url: string | null;
                                    }
                                }>;
                                subtotal: number;
                            }) => (
                                <div key={group.supplier.profile_id} className="overflow-hidden glass-panel transition-glass">
                                    <div className="border-b border-border bg-background/50 backdrop-blur-md px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
                                                    </svg>
                                                </div>
                                                <span className="font-semibold text-foreground break-all">{group.supplier.business_name}</span>
                                            </div>
                                            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                                Subtotal: <span className="text-foreground">${(group.subtotal / 100).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <ul className="divide-y divide-border">
                                        {group.items?.map((item) => (
                                            <li key={item.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800/50">
                                                    {item.product.image_url ? (
                                                        <Image
                                                            src={item.product.image_url}
                                                            alt={item.product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center text-xs text-zinc-400 dark:text-zinc-500 text-center px-2">No img</div>
                                                    )}
                                                </div>

                                                <div className="flex flex-1 flex-col justify-center">
                                                    <Link href={`/shop/browse/${item.product_id}`} className="font-semibold text-foreground hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
                                                        {item.product.name}
                                                    </Link>
                                                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                                        ${(item.product.price_per_unit / 100).toFixed(2)} each
                                                    </p>
                                                    <div className="mt-1 text-xs text-primary-600 dark:text-primary-500 font-medium tracking-wide">
                                                        {item.product.stock_qty} available
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    <p className="font-bold text-foreground">
                                                        ${(item.lineTotal / 100).toFixed(2)}
                                                    </p>
                                                    <CartItemControls
                                                        itemId={item.id}
                                                        quantity={item.quantity}
                                                        maxStock={item.product.stock_qty}
                                                    />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1 space-y-6">
                            {/* Shipping Calculator UI */}
                            <div className="glass-panel p-6 shadow-sm transition-glass bg-white dark:bg-zinc-950/80">
                                <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600">
                                        <rect x="3" y="11" width="18" height="10" rx="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    Calculate Shipping
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">COUNTRY/REGION</label>
                                        <select className="mt-1 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary-500 focus:outline-none">
                                            <option className="bg-background text-foreground">United States</option>
                                            <option className="bg-background text-foreground">Canada</option>
                                            <option className="bg-background text-foreground">Mexico</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">STATE</label>
                                            <input type="text" placeholder="State" className="mt-1 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary-500 focus:outline-none" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">ZIP CODE</label>
                                            <input type="text" placeholder="Zip" className="mt-1 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary-500 focus:outline-none" />
                                        </div>
                                    </div>
                                    <button className="w-full rounded-lg bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                                        Update Total
                                    </button>
                                </div>
                            </div>

                            <div className="sticky top-6 glass-heavy border-2 border-primary-500/20 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] transition-glass rounded-2xl">
                                <h2 className="text-lg font-bold text-foreground">Order Summary</h2>

                                <dl className="mt-6 space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
                                    <div className="flex items-center justify-between">
                                        <dt>Subtotal</dt>
                                        <dd className="font-medium text-foreground">${(cart.totalPrice / 100).toFixed(2)}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt>Taxes & Shipping</dt>
                                        <dd className="font-medium text-zinc-400">Calculated at checkout</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt>Supplier count</dt>
                                        <dd className="font-medium text-foreground">{cart.grouped?.length}</dd>
                                    </div>

                                    <div className="border-t border-border pt-4 flex items-center justify-between">
                                        <dt className="text-base font-bold text-foreground">Total</dt>
                                        <dd className="text-xl font-black text-foreground">${(cart.totalPrice / 100).toFixed(2)}</dd>
                                    </div>
                                </dl>

                                <Link
                                    href="/checkout/gateway"
                                    className="mt-8 flex w-full justify-center rounded-xl bg-primary-600 px-4 py-4 font-bold text-white text-lg transition-all hover:bg-primary-700 active:scale-95 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5"
                                >
                                    Proceed to Checkout
                                </Link>
                                <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
                                    Orders will be grouped by supplier and pending confirmation.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
