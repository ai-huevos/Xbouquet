import { getShopBilling } from '@/lib/actions/billing'
import { InvoiceDownloadButton } from '@/components/billing/InvoiceDownloadButton'

export const metadata = {
    title: 'Billing & Reconciliation | Xpress Buke',
    description: 'View your account balance, transaction history, and download Net-30 invoices.',
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getStatusStyle(status: string) {
    switch (status) {
        case 'delivered':
            return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
        case 'confirmed':
            return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
        case 'pending':
            return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
        case 'cancelled':
            return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
        default:
            return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
    }
}

export default async function ShopBillingPage() {
    const billing = await getShopBilling()

    const creditUtilization = billing && billing.creditLimit > 0
        ? (billing.currentBalance / billing.creditLimit) * 100
        : 0

    const utilizationColor = creditUtilization > 80 ? 'text-red-600 dark:text-red-400' : creditUtilization > 50 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'

    return (
        <div className="flex-1 animate-enter">
            <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 lg:py-6 sticky top-0 z-10 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Billing & Reconciliation</h2>
                    <p className="text-sm text-zinc-500 mt-0.5">Account balance, invoices, and payment history</p>
                </div>
            </header>

            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8 max-w-7xl mx-auto">
                {/* Balance Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-l-emerald-500 transition-glass">
                        <p className="text-zinc-500 text-sm font-medium">Available Credit</p>
                        <h3 className="text-2xl font-extrabold mt-1 text-emerald-600 dark:text-emerald-500">{formatCurrency(billing?.availableCredit ?? 0)}</h3>
                        <div className="mt-3 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${Math.max(100 - creditUtilization, 0)}%` }} />
                        </div>
                    </div>

                    <div className="glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-l-blue-500 transition-glass">
                        <p className="text-zinc-500 text-sm font-medium">Credit Limit</p>
                        <h3 className="text-2xl font-extrabold mt-1 text-foreground">{formatCurrency(billing?.creditLimit ?? 0)}</h3>
                        <p className="text-xs text-zinc-500 mt-2">Approved credit line</p>
                    </div>

                    <div className="glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-l-amber-500 transition-glass">
                        <p className="text-zinc-500 text-sm font-medium">Current Balance</p>
                        <h3 className={`text-2xl font-extrabold mt-1 ${utilizationColor}`}>{formatCurrency(billing?.currentBalance ?? 0)}</h3>
                        <p className="text-xs text-zinc-500 mt-2">{creditUtilization.toFixed(0)}% utilization</p>
                    </div>

                    <div className="glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-l-violet-500 transition-glass">
                        <p className="text-zinc-500 text-sm font-medium">Payment Terms</p>
                        <h3 className="text-2xl font-extrabold mt-1 text-foreground">{billing?.paymentTerms ?? 'N/A'}</h3>
                        <p className="text-xs text-zinc-500 mt-2">Invoice payment window</p>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Transaction History</h3>
                            <p className="text-sm text-zinc-500 mt-0.5">All orders and their payment status</p>
                        </div>
                    </div>
                    {billing && billing.transactions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 text-xs uppercase font-bold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Order ID</th>
                                        <th className="px-6 py-4">Supplier</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                        <th className="px-6 py-4">Due Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                                    {billing.transactions.map((tx) => (
                                        <tr key={tx.orderId} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                            <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{formatDate(tx.orderDate)}</td>
                                            <td className="px-6 py-4 font-mono font-medium text-zinc-600 dark:text-zinc-400 text-xs">
                                                {tx.orderId.slice(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-foreground">{tx.supplierName}</td>
                                            <td className="px-6 py-4 text-right font-bold text-foreground">{formatCurrency(tx.amount)}</td>
                                            <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{formatDate(tx.dueDate)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${getStatusStyle(tx.status)}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <InvoiceDownloadButton orderId={tx.orderId} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-zinc-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <p className="text-sm text-zinc-500 max-w-xs">No transactions yet. Place your first order to see billing history here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
