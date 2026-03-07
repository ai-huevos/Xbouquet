import { getProfile } from '@/lib/actions/profiles'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = {
    title: 'Your Orders | Xpress Buke',
}

export default async function ShopOrdersPage() {
    const profile = await getProfile()
    const supabase = await createClient()

    const { data: orders } = await supabase
        .from('orders')
        .select(`
            id,
            status,
            order_type,
            requested_delivery_date,
            created_at,
            supplier:supplier_profiles!orders_supplier_id_fkey ( business_name ),
            items:order_items (
                id,
                quantity,
                unit_price,
                product:flower_products ( name, box_type, stems_per_bunch )
            ),
            claims ( id, status )
        `)
        .eq('shop_id', profile.id)
        .order('created_at', { ascending: false })

    return (
        <div className="p-8 max-w-7xl mx-auto w-full animate-enter space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Order History</h2>

            {(!orders || orders.length === 0) ? (
                <div className="glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-12 text-center rounded-2xl flex flex-col items-center justify-center">
                    <p className="text-zinc-500">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order: any) => (
                        <div key={order.id} className="glass border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white/70 dark:bg-zinc-900/70 shadow-sm">
                            <div className="bg-zinc-50 dark:bg-zinc-950/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800">
                                <div>
                                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Order Placed</p>
                                    <p className="font-semibold text-foreground">{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(order.created_at))}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Supplier</p>
                                    <p className="font-semibold text-foreground">{order.supplier?.business_name || 'Unknown'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Order # / Status</p>
                                    <div className="flex items-center gap-2 justify-end">
                                        <span className="font-mono text-xs text-zinc-400">...{order.id.slice(-6)}</span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4">
                                <h4 className="font-bold text-sm text-zinc-700 dark:text-zinc-300 mb-3 uppercase tracking-wider">Items</h4>
                                <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                                    {order.items?.map((item: any) => {
                                        const hasClaim = order.claims && order.claims.some((c: any) => c.order_item_id === item.id)
                                        return (
                                            <li key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-foreground">{item.product?.name}</p>
                                                    <p className="text-sm text-zinc-500">
                                                        Qty: {item.quantity}
                                                        {item.product?.box_type && ` • Box: ${item.product.box_type}`}
                                                        {item.product?.stems_per_bunch ? ` • ${item.product.stems_per_bunch} stems/bunch` : ''}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-bold text-foreground">${(item.unit_price * item.quantity / 100).toFixed(2)}</span>
                                                    {hasClaim ? (
                                                        <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded">Claim Active</span>
                                                    ) : (
                                                        <Link
                                                            href={`/shop/claims/new?item_id=${item.id}`}
                                                            className="text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700"
                                                        >
                                                            Report Issue
                                                        </Link>
                                                    )}
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>

                            {(order.order_type === 'prebook' || order.order_type === 'standing') && (
                                <div className="bg-primary-500/5 px-6 py-3 border-t border-primary-500/10">
                                    <p className="text-xs font-medium text-primary-600 dark:text-primary-400">
                                        <span className="uppercase tracking-wider mr-2">{order.order_type} ORDER</span>
                                        Requested Delivery: {order.requested_delivery_date || 'TBD'}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
