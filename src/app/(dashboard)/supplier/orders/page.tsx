import { getSupplierOrders, updateOrderStatus } from '@/lib/actions/dashboard'
import Link from 'next/link'

export const metadata = {
    title: 'Order Management | Xpress Buke',
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function getStatusBadgeClasses(status: string): string {
    const map: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500',
        confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500',
        processing: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500',
        delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-500',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-500',
    }
    return map[status] ?? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-500/10 dark:text-zinc-400'
}

function getNextAction(status: string): { label: string; nextStatus: string; color: string } | null {
    switch (status) {
        case 'pending': return { label: 'Confirm', nextStatus: 'confirmed', color: 'bg-blue-600 hover:bg-blue-700' }
        case 'confirmed': return { label: 'Mark Delivered', nextStatus: 'delivered', color: 'bg-emerald-600 hover:bg-emerald-700' }
        default: return null
    }
}

export default async function SupplierOrdersPage() {
    const orders = await getSupplierOrders()

    const statusCounts = {
        all: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
    }

    return (
        <div className="animate-enter">
            <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 lg:py-6 sticky top-0 z-10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Order Management</h2>
                    <span className="text-sm text-zinc-400 font-medium">{orders.length} total</span>
                </div>
            </header>

            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 max-w-7xl mx-auto">
                {/* Status Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'Pending', count: statusCounts.pending, color: 'text-amber-600 dark:text-amber-500' },
                        { label: 'Confirmed', count: statusCounts.confirmed, color: 'text-blue-600 dark:text-blue-500' },
                        { label: 'Delivered', count: statusCounts.delivered, color: 'text-emerald-600 dark:text-emerald-500' },
                        { label: 'Cancelled', count: statusCounts.cancelled, color: 'text-red-500' },
                    ].map((s) => (
                        <div key={s.label} className="glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-4 rounded-xl text-center">
                            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{s.label}</p>
                            <p className={`text-2xl font-extrabold mt-1 ${s.color}`}>{s.count}</p>
                        </div>
                    ))}
                </div>

                {/* Orders Table */}
                <div className="glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Shop</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 text-primary-500">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-bold text-foreground">No orders yet</h3>
                                                <p className="text-zinc-500 text-sm max-w-sm">When shops place orders for your products, they&apos;ll appear here for you to manage.</p>
                                                <Link href="/supplier/products" className="text-primary-600 hover:text-primary-700 font-semibold text-sm mt-2">
                                                    Manage your products &rarr;
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => {
                                        const action = getNextAction(order.status)
                                        return (
                                            <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                                <td className="px-6 py-4 font-mono font-medium text-zinc-600 dark:text-zinc-400 text-xs">{order.id.slice(0, 8)}…</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                            {order.shop_name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-semibold text-foreground">{order.shop_name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-foreground">{formatCurrency(order.total)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${getStatusBadgeClasses(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-zinc-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-right">
                                                    {action && (
                                                        <form action={async () => {
                                                            'use server'
                                                            await updateOrderStatus(order.id, action.nextStatus)
                                                        }}>
                                                            <button
                                                                type="submit"
                                                                className={`${action.color} text-white px-4 py-1.5 rounded-lg font-bold transition-transform active:scale-95 text-sm`}
                                                            >
                                                                {action.label}
                                                            </button>
                                                        </form>
                                                    )}
                                                    {order.status === 'delivered' && (
                                                        <span className="text-xs text-emerald-600 font-semibold">✓ Complete</span>
                                                    )}
                                                    {order.status === 'cancelled' && (
                                                        <span className="text-xs text-zinc-400 font-medium">Cancelled</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
