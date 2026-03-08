import { getAdminClaims } from '@/lib/actions/admin'
import { DisputeRow } from '@/components/admin/DisputeRow'

export default async function AdminDisputesPage() {
    const claims = await getAdminClaims()

    return (
        <div className="p-8 max-w-5xl mx-auto w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100">Dispute Resolution</h1>
                <p className="text-zinc-500 mt-2 text-lg">Review and resolve quality claims from shops.</p>
            </div>

            {claims.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">All Clear</h3>
                    <p className="text-zinc-500 mt-2">There are no pending disputes to review.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {claims.map((claim: any) => (
                        <DisputeRow key={claim.id} claim={claim} />
                    ))}
                </div>
            )}
        </div>
    )
}
