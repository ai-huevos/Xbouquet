import { getProfile } from '@/lib/actions/profiles'
import { createClient } from '@/lib/supabase/server'
import { updateClaimStatus } from '@/lib/actions/claims'

export const metadata = {
    title: 'Quality Claims | Supplier Dashboard',
}

export default async function SupplierClaimsPage() {
    const profile = await getProfile()
    const supabase = await createClient()

    const { data: claims } = await supabase
        .from('claims')
        .select(`
            id,
            status,
            reason,
            requested_credit_amount,
            description,
            created_at,
            shop:shop_profiles!claims_shop_id_fkey ( business_name ),
            item:order_items (
                quantity,
                unit_price,
                product:flower_products ( name )
            )
        `)
        .eq('supplier_id', profile.id)
        .order('created_at', { ascending: false })

    return (
        <div className="p-8 max-w-7xl mx-auto w-full animate-enter space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Quality Claims Management</h2>

            {(!claims || claims.length === 0) ? (
                <div className="glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-12 text-center rounded-2xl flex flex-col items-center justify-center">
                    <p className="text-zinc-500">No quality claims have been filed against your products.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {claims.map((claim: any) => (
                        <div key={claim.id} className="glass border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white/70 dark:bg-zinc-900/70 shadow-sm flex flex-col md:flex-row">
                            <div className="p-6 flex-1 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${claim.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                claim.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                }`}>
                                                {claim.status}
                                            </span>
                                            <span className="text-xs text-zinc-500 font-medium">{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(claim.created_at))}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground">{claim.reason}</h3>
                                        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">Shop: {claim.shop?.business_name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Requested Credit</p>
                                        <p className="text-xl font-extrabold text-foreground">${(claim.requested_credit_amount / 100).toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/50 text-sm text-zinc-700 dark:text-zinc-300">
                                    <span className="font-semibold block mb-1">Customer Notes:</span>
                                    {claim.description}
                                </div>

                                <div className="text-sm text-zinc-500">
                                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Related Item:</span> {claim.item?.product?.name} (Qty: {claim.item?.quantity})
                                </div>
                            </div>

                            {claim.status === 'pending' && (
                                <div className="p-6 md:w-80 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col justify-center gap-4">
                                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 text-center">Process Claim</p>
                                    <form action={async (formData) => {
                                        'use server'
                                        const action = formData.get('action') as 'approved' | 'rejected'
                                        await updateClaimStatus(claim.id, action, 'Processed by supplier')
                                    }}>
                                        <div className="space-y-3">
                                            <button
                                                type="submit"
                                                name="action"
                                                value="approved"
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                                            >
                                                Approve & Issue Credit
                                            </button>
                                            <button
                                                type="submit"
                                                name="action"
                                                value="rejected"
                                                className="w-full bg-white dark:bg-zinc-950 border-2 border-red-500/20 hover:border-red-500 text-red-600 dark:text-red-400 font-bold py-2.5 rounded-xl transition-all"
                                            >
                                                Reject Claim
                                            </button>
                                        </div>
                                    </form>
                                    <p className="text-xs text-zinc-500 text-center">Approving will automatically deduct the amount from the shop's account balance if they have B2B terms.</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
