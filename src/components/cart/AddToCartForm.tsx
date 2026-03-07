'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addToCart } from '@/lib/actions/cart'

interface AddToCartFormProps {
    productId: string
    stockQty: number
    minOrder?: number
}

export function AddToCartForm({ productId, stockQty, minOrder = 1 }: AddToCartFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [quantity, setQuantity] = useState(minOrder)
    const [error, setError] = useState<string | null>(null)

    const handleDecrement = () => {
        if (quantity > minOrder) setQuantity(q => q - 1)
    }

    const handleIncrement = () => {
        if (quantity < stockQty) setQuantity(q => q + 1)
    }

    async function handleAddToCart(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        startTransition(async () => {
            const result = await addToCart(productId, quantity)

            if (result.error) {
                setError(result.error)
            } else {
                router.push('/shop/cart')
            }
        })
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-slate-700/50">
            <form onSubmit={handleAddToCart} className="flex flex-col">
                {error && (
                    <div className="absolute -top-12 left-4 right-4 p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs text-center backdrop-blur-md">
                        {error}
                    </div>
                )}

                <div className="max-w-md mx-auto w-full p-4 flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">Quantity</span>
                        <div className="flex items-center gap-3 bg-zinc-900/50 border border-slate-700/50 rounded-lg p-1">
                            <button
                                type="button"
                                onClick={handleDecrement}
                                disabled={quantity <= minOrder || isPending}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-100 disabled:opacity-50 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /></svg>
                            </button>

                            <input
                                type="number"
                                name="quantity"
                                value={quantity}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value)
                                    if (!isNaN(val) && val >= minOrder && val <= stockQty) {
                                        setQuantity(val)
                                    }
                                }}
                                min={minOrder}
                                max={stockQty}
                                className="w-8 bg-transparent text-center text-sm font-bold text-slate-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0 border-none ring-0"
                                disabled={isPending}
                            />

                            <button
                                type="button"
                                onClick={handleIncrement}
                                disabled={quantity >= stockQty || isPending}
                                className="w-8 h-8 flex items-center justify-center text-primary-500 hover:text-primary-400 disabled:opacity-50 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={stockQty === 0 || isPending}
                        className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {isPending ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                                Add to Cart
                            </>
                        )}
                    </button>
                </div>
                {/* Safe area inset for mobile */}
                <div className="h-6"></div>
            </form>
        </div>
    )
}
