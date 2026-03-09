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
        <div className="w-full mt-4">
            <form onSubmit={handleAddToCart} className="flex flex-col relative">
                {error && (
                    <div className="absolute -top-12 left-0 right-0 p-2 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg text-xs text-center backdrop-blur-md">
                        {error}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                    {/* Quantity Container */}
                    <div className="flex items-center h-14 bg-slate-100 dark:bg-slate-800/50 rounded-xl px-2 w-full sm:w-auto border border-slate-200 dark:border-slate-700/50">
                        <button
                            type="button"
                            onClick={handleDecrement}
                            disabled={quantity <= minOrder || isPending}
                            className="size-10 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400 disabled:opacity-50"
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
                            className="w-16 bg-transparent border-none text-center font-bold text-lg focus:ring-0 text-slate-800 dark:text-slate-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0"
                            disabled={isPending}
                        />

                        <button
                            type="button"
                            onClick={handleIncrement}
                            disabled={quantity >= stockQty || isPending}
                            className="size-10 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400 disabled:opacity-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                        </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        type="submit"
                        disabled={stockQty === 0 || isPending}
                        className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-full disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100"
                    >
                        {isPending ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                                Add to Cart
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
