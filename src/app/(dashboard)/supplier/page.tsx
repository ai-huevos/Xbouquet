import { getProfile } from '@/lib/actions/profiles'
import { getSupplierProducts } from '@/lib/actions/products'
import Link from 'next/link'
import Image from 'next/image'

export default async function SupplierDashboard() {
    const profile = await getProfile()
    const products = await getSupplierProducts()

    return (
        <div className="animate-enter">
            <header className="flex items-center justify-between px-8 py-6 sticky top-0 z-10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Marketplace Overview</h2>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative group hidden sm:block">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary-600 transition-colors"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                        <input type="text" placeholder="Search orders or products..." className="pl-10 pr-4 py-2 w-64 bg-white/50 dark:bg-black/20 border-zinc-200 dark:border-zinc-800 text-foreground rounded-lg focus:ring-primary-500 focus:border-primary-500 border transition-all glass outline-none" />
                    </div>
                    <Link href="/supplier/products/new" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-primary-500/20 active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Add Product
                    </Link>
                </div>
            </header>

            <div className="px-8 py-8 space-y-8 max-w-7xl mx-auto">
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-zinc-500 text-sm font-medium">Total Sales</p>
                                <h3 className="text-3xl font-extrabold mt-1 text-foreground">$42,850.00</h3>
                            </div>
                            <div className="p-2 bg-primary-500/10 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary-600 dark:text-primary-500"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                            </div>
                        </div>
                        <div className="w-full h-12 flex items-end gap-1 opacity-80">
                            {[0.5, 0.66, 0.33, 0.75, 0.5, 0.83, 0.5, 0.75, 1.0].map((h, i) => (
                                <div key={i} className={`w-3 rounded-t-full ${i === 8 ? 'bg-primary-500' : 'bg-primary-500/30 dark:bg-primary-500/20'}`} style={{ height: `${h * 100}%` }}></div>
                            ))}
                        </div>
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-500">+18% from last month</p>
                    </div>

                    <div className="glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-6 rounded-2xl flex flex-col justify-between group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-zinc-500 text-sm font-medium">Active Products</p>
                                <h3 className="text-3xl font-extrabold mt-1 text-foreground">{products.length}</h3>
                            </div>
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-500"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-200 dark:bg-zinc-700"></div>
                                <div className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-300 dark:bg-zinc-600"></div>
                                <div className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-400 dark:bg-zinc-500"></div>
                            </div>
                            <Link href="/supplier/products" className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-primary-600 transition-colors">Manage listings &rarr;</Link>
                        </div>
                    </div>

                    <div className="glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-6 rounded-2xl flex flex-col justify-between group border-l-4 border-l-amber-400">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-zinc-500 text-sm font-medium">Pending Orders</p>
                                <h3 className="text-3xl font-extrabold mt-1 text-amber-600 dark:text-amber-500">24</h3>
                            </div>
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-amber-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </div>
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-500 mt-4">Requires immediate action</p>
                    </div>
                </div>

                {/* Incoming Orders Table */}
                <div className="glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-foreground">Incoming Orders</h3>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">Filter</button>
                            <button className="px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">Export CSV</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Shop Name</th>
                                    <th className="px-6 py-4">Total Price</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                                {[
                                    { id: '#ORD-2984', shop: 'Velvet Petals Boutique', initial: 'V', price: '$1,420.00', status: 'Pending', statusColor: 'amber' },
                                    { id: '#ORD-2983', shop: 'Azure Floral Design', initial: 'A', price: '$840.00', status: 'Processing', statusColor: 'emerald' },
                                    { id: '#ORD-2982', shop: 'Greenhouse & Co.', initial: 'G', price: '$2,105.50', status: 'Pending', statusColor: 'amber' },
                                    { id: '#ORD-2981', shop: 'Luna Blooms', initial: 'L', price: '$590.00', status: 'Processing', statusColor: 'emerald' },
                                ].map((order) => (
                                    <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium text-zinc-600 dark:text-zinc-400">{order.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${order.statusColor === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>{order.initial}</div>
                                                <span className="font-semibold text-foreground">{order.shop}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-foreground">{order.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${order.statusColor === 'amber' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-500'}`}>{order.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link href="/supplier/orders" className="text-zinc-400 hover:text-foreground font-medium transition-colors text-sm">Details</Link>
                                                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 rounded-lg font-bold transition-transform active:scale-95 text-sm">Fulfill</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 text-center">
                        <button className="text-zinc-500 hover:text-foreground text-sm font-semibold flex items-center justify-center gap-1 mx-auto transition-colors">
                            View All Orders
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-6 rounded-2xl">
                        <h4 className="font-bold mb-4 text-foreground">Top Rated Products</h4>
                        <div className="space-y-4">
                            {products.length === 0 ? (
                                <p className="text-sm text-zinc-500 font-medium">No products added yet.</p>
                            ) : (
                                products.slice(0, 2).map((product) => (
                                    <div key={product.id} className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 rounded-lg border border-zinc-200 dark:border-zinc-800 shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                            {product.image_url ? (
                                                <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400 font-medium">No img</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-foreground truncate">{product.name}</p>
                                            <p className="text-xs text-zinc-500 truncate">{product.category?.name || 'Uncategorized'}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-bold text-sm text-foreground">5.0/5</p>
                                            <p className="text-xs text-emerald-600 dark:text-emerald-500">New</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-6 rounded-2xl flex items-center gap-6">
                        <div className="flex-1">
                            <h4 className="font-bold text-lg leading-tight mb-2 text-foreground">Need logistical help?</h4>
                            <p className="text-sm text-zinc-500 mb-4">Our logistics partners can help you ship flowers across continents in under 24 hours.</p>
                            <button className="text-emerald-600 dark:text-emerald-500 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                Connect Partner
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                        <div className="w-32 h-32 bg-primary-500/10 rounded-full flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-primary-600 dark:text-primary-500"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
