'use client'
import { useState, useTransition } from 'react'
import { resolveAdminClaim } from '@/lib/actions/admin'

export function DisputeRow({ claim }: { claim: any }) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const handleResolve = (action: 'approved' | 'rejected') => {
        startTransition(async () => {
            setError(null)
            const result = await resolveAdminClaim(claim.id, action)
            if (result?.error) {
                setError(result.error)
            }
        })
    }

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 capitalize">{claim.reason.replace('_', ' ')}</h3>
                    <p className="text-sm text-zinc-500 mt-1">Order Item: {claim.order_item?.product?.title}</p>
                    <p className="text-sm text-zinc-500">Shop: {claim.shop?.profiles?.full_name}</p>
                    <p className="text-sm text-zinc-500">Supplier: {claim.supplier?.profiles?.full_name}</p>
                </div>
                <div className="text-right">
                    <div className="text-emerald-600 font-bold text-lg">
                        ${(claim.requested_credit_amount / 100).toFixed(2)}
                    </div>
                    <span className={`inline-block mt-2 px-2.5 py-1 text-xs font-semibold rounded-full ${claim.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            claim.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                'bg-red-100 text-red-800'
                        }`}>
                        {claim.status.replace('_', ' ').toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 mb-4">
                <span className="font-semibold block mb-1">Description:</span>
                {claim.description || 'No description provided.'}
            </div>

            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            {claim.status === 'pending' && (
                <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                        onClick={() => handleResolve('rejected')}
                        disabled={isPending}
                        className="px-4 py-2 text-sm font-semibold rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                        {isPending ? 'Processing...' : 'Reject'}
                    </button>
                    <button
                        onClick={() => handleResolve('approved')}
                        disabled={isPending}
                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 shadow-sm transition-colors"
                    >
                        {isPending ? 'Processing...' : 'Approve Credit'}
                    </button>
                </div>
            )}
        </div>
    )
}
