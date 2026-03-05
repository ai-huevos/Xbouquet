'use client'

import { useState } from 'react'
import { updateCartItem, removeFromCart } from '@/lib/actions/cart'

interface CartItemControlProps {
    itemId: string
    quantity: number
    maxStock: number
}

export default function CartItemControls({ itemId, quantity, maxStock }: CartItemControlProps) {
    const [isPending, setIsPending] = useState(false)
    const [currentQty, setCurrentQty] = useState(quantity)

    const handleUpdate = async (newQty: number) => {
        if (newQty < 1 || newQty > maxStock) return
        setIsPending(true)
        setCurrentQty(newQty)
        await updateCartItem(itemId, newQty)
        setIsPending(false)
    }

    const handleRemove = async () => {
        setIsPending(true)
        await removeFromCart(itemId)
    }

    return (
        <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
            <div className="flex h-10 items-center rounded-lg border border-gray-200 bg-white">
                <button
                    onClick={() => handleUpdate(currentQty - 1)}
                    disabled={isPending || currentQty <= 1}
                    className="flex h-10 w-10 items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 rounded-l-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                    </svg>
                </button>
                <div className="flex h-10 w-12 items-center justify-center border-x border-gray-200 font-medium text-gray-900 text-sm">
                    {currentQty}
                </div>
                <button
                    onClick={() => handleUpdate(currentQty + 1)}
                    disabled={isPending || currentQty >= maxStock}
                    className="flex h-10 w-10 items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 rounded-r-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" /><path d="M12 5v14" />
                    </svg>
                </button>
            </div>
            <button
                onClick={handleRemove}
                disabled={isPending}
                className="text-sm font-medium text-rose-600 hover:text-rose-700 disabled:opacity-50 transition-colors"
            >
                Remove
            </button>
        </div>
    )
}
