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
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
                            Your Cart
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            {cart.totalCount} {cart.totalCount === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>
                    {cart.totalCount && cart.totalCount > 0 && (
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-medium text-gray-500">Cart Total</p>
                            <p className="text-3xl font-black text-gray-900">
                                ${(cart.totalPrice / 100).toFixed(2)}
                            </p>
                        </div>
                    )}
                </div>

                {!cart.totalCount || cart.totalCount === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white py-32 text-center shadow-sm">
                        <div className="mb-4 rounded-full bg-gray-100 p-6 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Your cart is empty</h3>
                        <p className="mt-2 text-gray-500 max-w-sm">
                            Looks like you haven&apos;t added any flowers to your cart yet.
                        </p>
                        <Link
                            href="/shop/browse"
                            className="mt-8 rounded-xl bg-gray-900 px-8 py-3.5 font-semibold text-white transition-all hover:bg-gray-800 active:scale-95"
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
                                <div key={group.supplier.profile_id} className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <div className="border-b border-gray-100 bg-gray-50/80 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
                                                    </svg>
                                                </div>
                                                <span className="font-semibold text-gray-900 break-all">{group.supplier.business_name}</span>
                                            </div>
                                            <div className="text-sm font-medium text-gray-500">
                                                Subtotal: <span className="text-gray-900">${(group.subtotal / 100).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <ul className="divide-y divide-gray-100">
                                        {group.items?.map((item) => (
                                            <li key={item.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                                    {item.product.image_url ? (
                                                        <Image
                                                            src={item.product.image_url}
                                                            alt={item.product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center text-xs text-gray-400 text-center px-2">No img</div>
                                                    )}
                                                </div>

                                                <div className="flex flex-1 flex-col justify-center">
                                                    <Link href={`/shop/browse/${item.product_id}`} className="font-semibold text-gray-900 hover:text-rose-600 transition-colors">
                                                        {item.product.name}
                                                    </Link>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        ${(item.product.price_per_unit / 100).toFixed(2)} each
                                                    </p>
                                                    <div className="mt-1 text-xs text-emerald-600 font-medium tracking-wide">
                                                        {item.product.stock_qty} available
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    <p className="font-bold text-gray-900">
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

                        <div className="lg:col-span-1">
                            <div className="sticky top-6 rounded-2xl bg-white border border-gray-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

                                <dl className="mt-6 space-y-4 text-sm text-gray-600">
                                    <div className="flex items-center justify-between">
                                        <dt>Subtotal</dt>
                                        <dd className="font-medium text-gray-900">${(cart.totalPrice / 100).toFixed(2)}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt>Supplier count</dt>
                                        <dd className="font-medium text-gray-900">{cart.grouped?.length}</dd>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                                        <dt className="text-base font-bold text-gray-900">Total</dt>
                                        <dd className="text-xl font-black text-gray-900">${(cart.totalPrice / 100).toFixed(2)}</dd>
                                    </div>
                                </dl>

                                <form className="mt-8" action={async () => {
                                    'use server'
                                    const { checkout } = await import('@/lib/actions/orders')
                                    await checkout()
                                }}>
                                    <button
                                        type="submit"
                                        className="w-full rounded-xl bg-gray-900 px-4 py-4 font-semibold text-white transition-all hover:bg-gray-800 active:scale-95 shadow-sm"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </form>
                                <p className="mt-4 text-center text-xs text-gray-500">
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
