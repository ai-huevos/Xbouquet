import { getSupplierAnalytics } from '@/lib/actions/analytics'

export const metadata = {
    title: 'Supplier Analytics | Xpress Buke',
    description: 'Track your sales performance, revenue trends, and top products on the Xpress Buke marketplace.',
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export default async function SupplierAnalyticsPage() {
    const analytics = await getSupplierAnalytics()

    const hasData = analytics && analytics.totalOrders > 0
    const maxMonthlyRevenue = analytics?.monthlyRevenue.reduce((max, m) => Math.max(max, m.revenue), 0) || 1

    return (
        <div className="animate-enter">
            <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 lg:py-6 sticky top-0 z-10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Analytics & ROI</h2>
                    <p className="text-sm text-zinc-500 mt-0.5">Track your marketplace performance</p>
                </div>
            </header>

            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8 max-w-7xl mx-auto">
                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <KpiCard
                        label="Total Revenue"
                        value={formatCurrency(analytics?.totalRevenue ?? 0)}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        }
                        iconBg="bg-emerald-500/10"
                        iconColor="text-emerald-600 dark:text-emerald-500"
                        accent="border-l-emerald-500"
                    />
                    <KpiCard
                        label="Orders Fulfilled"
                        value={`${analytics?.fulfilledOrders ?? 0} / ${analytics?.totalOrders ?? 0}`}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        }
                        iconBg="bg-blue-500/10"
                        iconColor="text-blue-600 dark:text-blue-500"
                        accent="border-l-blue-500"
                    />
                    <KpiCard
                        label="Fulfillment Rate"
                        value={`${(analytics?.fulfillmentRate ?? 0).toFixed(1)}%`}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                        }
                        iconBg="bg-violet-500/10"
                        iconColor="text-violet-600 dark:text-violet-500"
                        accent="border-l-violet-500"
                    />
                    <KpiCard
                        label="Avg Order Value"
                        value={formatCurrency(analytics?.avgOrderValue ?? 0)}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                        }
                        iconBg="bg-amber-500/10"
                        iconColor="text-amber-600 dark:text-amber-500"
                        accent="border-l-amber-500"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Trend */}
                    <div className="lg:col-span-2 glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-foreground mb-6">Revenue Trend</h3>
                        {hasData && analytics.monthlyRevenue.length > 0 ? (
                            <div className="flex items-end gap-3" style={{ height: '192px' }}>
                                {analytics.monthlyRevenue.map((month, i) => {
                                    const pct = maxMonthlyRevenue > 0 ? (month.revenue / maxMonthlyRevenue) * 100 : 0
                                    const barHeight = Math.max(Math.round((pct / 100) * 160), 8)
                                    const isLast = i === analytics.monthlyRevenue.length - 1
                                    return (
                                        <div key={month.month} className="flex-1 flex flex-col items-center justify-end gap-2">
                                            <span className="text-xs font-bold text-foreground">{formatCurrency(month.revenue)}</span>
                                            <div
                                                className={`w-10 rounded-t-lg transition-all ${isLast ? 'bg-gradient-to-t from-primary-600 to-primary-400 shadow-lg shadow-primary-500/20' : 'bg-primary-500/25 dark:bg-primary-500/15'}`}
                                                style={{ height: `${barHeight}px` }}
                                            />
                                            <span className="text-xs text-zinc-500 font-medium">{month.month}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <EmptyState message="Revenue trend will appear once you have orders" />
                        )}
                    </div>

                    {/* Revenue by Order Type */}
                    <div className="glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-foreground mb-6">By Order Type</h3>
                        {hasData && analytics.revenueByOrderType.length > 0 ? (
                            <div className="space-y-5">
                                {analytics.revenueByOrderType.map((type) => {
                                    const pct = analytics.totalRevenue > 0 ? (type.revenue / analytics.totalRevenue) * 100 : 0
                                    const colors: Record<string, string> = {
                                        Immediate: 'bg-emerald-500',
                                        Prebook: 'bg-blue-500',
                                        Standing: 'bg-violet-500',
                                    }
                                    return (
                                        <div key={type.type}>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="font-semibold text-foreground">{type.type}</span>
                                                <span className="text-zinc-500">{type.count} orders · {formatCurrency(type.revenue)}</span>
                                            </div>
                                            <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full transition-all ${colors[type.type] || 'bg-primary-500'}`} style={{ width: `${Math.max(pct, 2)}%` }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <EmptyState message="Order type breakdown will appear here" />
                        )}
                    </div>
                </div>

                {/* Top Products Table */}
                <div className="glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-lg font-bold text-foreground">Top Products by Revenue</h3>
                    </div>
                    {hasData && analytics.topProducts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 text-xs uppercase font-bold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">#</th>
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4 text-right">Units Sold</th>
                                        <th className="px-6 py-4 text-right">Revenue</th>
                                        <th className="px-6 py-4 text-right">% of Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                                    {analytics.topProducts.map((product, index) => (
                                        <tr key={product.name} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${index === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                                                    {index + 1}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-foreground">{product.name}</td>
                                            <td className="px-6 py-4 text-right text-zinc-600 dark:text-zinc-400 font-mono">{product.unitsSold.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right font-bold text-foreground">{formatCurrency(product.revenue)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="w-16 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${product.pctOfTotal}%` }} />
                                                    </div>
                                                    <span className="text-zinc-500 text-xs font-mono w-12 text-right">{product.pctOfTotal.toFixed(1)}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12">
                            <EmptyState message="Your top performing products will be displayed here once you start receiving orders" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function KpiCard({ label, value, icon, iconBg, iconColor, accent }: {
    label: string
    value: string
    icon: React.ReactNode
    iconBg: string
    iconColor: string
    accent: string
}) {
    return (
        <div className={`glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-6 rounded-2xl border-l-4 ${accent} transition-glass`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-zinc-500 text-sm font-medium">{label}</p>
                    <h3 className="text-2xl font-extrabold mt-1 text-foreground">{value}</h3>
                </div>
                <div className={`p-2.5 ${iconBg} rounded-xl`}>
                    <span className={iconColor}>{icon}</span>
                </div>
            </div>
        </div>
    )
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-zinc-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
            </div>
            <p className="text-sm text-zinc-500 max-w-xs">{message}</p>
        </div>
    )
}
