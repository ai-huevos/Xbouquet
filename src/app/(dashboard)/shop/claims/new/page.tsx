'use client'

import { createClaim } from '@/lib/actions/claims'
import { useRouter, useSearchParams } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { FormEvent, useRef, Suspense } from 'react'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full flex justify-center items-center gap-2 rounded-xl px-4 py-3 font-bold text-white transition-all shadow-lg 
                ${pending
                    ? 'bg-zinc-400 cursor-not-allowed shadow-none'
                    : 'bg-primary-600 hover:bg-primary-700 active:scale-95 shadow-primary-500/30'
                }`}
        >
            {pending ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                </>
            ) : (
                'Submit Claim'
            )}
        </button>
    )
}

export default function NewClaimPage() {
    return (
        <Suspense fallback={<div className="p-8"><p>Loading claim form...</p></div>}>
            <ClaimFormContent />
        </Suspense>
    )
}

function ClaimFormContent() {
    const searchParams = useSearchParams()
    const itemId = searchParams.get('item_id')
    const router = useRouter()
    const formRef = useRef<HTMLFormElement>(null)

    if (!itemId) {
        return (
            <div className="p-8 max-w-2xl mx-auto w-full">
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl">
                    Invalid order item specified. Please return to your orders and try again.
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-2xl mx-auto w-full animate-enter">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-foreground transition-colors mb-6"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>
                Back to Orders
            </button>

            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Report a Quality Issue</h2>
            <p className="text-zinc-500 mb-8">Submit a claim for damaged or missing items. We will review your request promptly.</p>

            <div className="glass border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-8 rounded-2xl shadow-sm">
                <form
                    ref={formRef}
                    action={async (formData) => {
                        const res = await createClaim(formData)
                        if (res?.error) {
                            alert(res.error)
                        } else {
                            if (formRef.current) formRef.current.reset()
                            router.push('/shop/orders')
                        }
                    }}
                    className="space-y-6"
                >
                    <input type="hidden" name="order_item_id" value={itemId} />

                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Primary Reason</label>
                        <select
                            name="reason"
                            required
                            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        >
                            <option value="">Select a reason...</option>
                            <option value="Botrytis / Rot">Botrytis / Rot</option>
                            <option value="Broken Heads / Stems">Broken Heads / Stems</option>
                            <option value="Dehydration">Severe Dehydration</option>
                            <option value="Pest Damage">Pest Damage</option>
                            <option value="Wrong Item">Received Wrong Item</option>
                            <option value="Missing Item">Missing from Shipment</option>
                            <option value="Other">Other Quality Issue</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Requested Credit Amount ($)</label>
                        <input
                            type="number"
                            name="requested_credit_amount"
                            step="0.01"
                            min="0"
                            required
                            placeholder="0.00"
                            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        />
                        <p className="text-xs text-zinc-500 mt-2">Enter the exact dollar amount you are requesting as a credit.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Detailed Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            required
                            placeholder="Please describe the extent of the damage or issue..."
                            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                        />
                    </div>

                    <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    )
}
