'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addToCart } from '@/lib/actions/cart'

interface AddToCartFormProps {
    productId: string
    stockQty: number
}

export function AddToCartForm({ productId, stockQty }: AddToCartFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [quantity, setQuantity] = useState(1)
    const [error, setError] = useState<string | null>(null)

    const handleDecrement = () => {
        if (quantity > 1) setQuantity(q => q - 1)
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
        <form onSubmit={handleAddToCart} className="flex flex-col gap-4 sm:flex-row">
            {error && (
                <div className="absolute -top-12 left-0 right-0 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            <div className="flex h-14 items-center rounded-xl border border-gray-200 bg-gray-50 px-2 sm:w-32">
                <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={quantity <= 1 || isPending}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors disabled:opacity-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                    </svg>
                </button>
                <input
                    type="number"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => {
                        const val = parseInt(e.target.value)
                        if (!isNaN(val) && val >= 1 && val <= stockQty) {
                            setQuantity(val)
                        }
                    }}
                    min={1}
                    max={stockQty}
                    className="w-full bg-transparent text-center font-semibold text-gray-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    disabled={isPending}
                />
                <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={quantity >= stockQty || isPending}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors disabled:opacity-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" /><path d="M12 5v14" />
                    </svg>
                </button>
            </div>

            <button
                type="submit"
                disabled={stockQty === 0 || isPending}
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 font-semibold text-white transition-all hover:bg-gray-800 active:scale-95 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden"
            >
                {isPending ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                        </svg>
                        Add to Cart
                    </>
                )}
            </button>
        </form>
    )
}
