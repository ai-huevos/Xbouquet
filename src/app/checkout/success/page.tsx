import Link from 'next/link'

export const metadata = {
    title: 'Order Successful | Xpress Buke'
}

export default function OrderSuccessPage() {
    return (
        <div className="flex flex-col items-center justify-center p-6 md:p-12 min-h-[calc(100vh-4rem)] animate-enter">
            <div className="w-full max-w-md mx-auto relative flex-1 flex flex-col bg-gradient-to-b from-primary-500/10 to-zinc-50 dark:from-primary-500/5 dark:to-zinc-950 overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl pb-10">
                <header className="flex items-center justify-between p-6">
                    <Link href="/shop/browse" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/40 dark:bg-black/20 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    </Link>
                    <div className="flex-1 text-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-500">Confirmation</span>
                    </div>
                </header>

                <div className="flex flex-col items-center px-6 pt-4 text-center">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full"></div>
                        <div className="relative w-24 h-24 rounded-full bg-white/40 dark:bg-black/20 backdrop-blur-md flex items-center justify-center border-2 border-primary-500/50 shadow-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-primary-600 dark:text-primary-500">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight mb-3 text-foreground">Order Success!</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-xs">Your wholesale floral request has been processed and is being prepared for transit.</p>
                </div>

                <div className="px-6 mt-10 mb-8">
                    <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white dark:border-zinc-800 space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Order ID</p>
                                <p className="font-bold text-foreground">FL-88291</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Estimated Arrival</p>
                                <p className="font-bold text-foreground">Pending</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-cover bg-center shrink-0 border border-zinc-200 dark:border-zinc-800" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1563241598-6ce2b627be25?auto=format&fit=crop&q=80&w=200')" }}></div>
                            <div className="flex-1">
                                <p className="text-sm font-bold leading-snug text-foreground">Xpress Buke Collection</p>
                                <p className="text-xs text-zinc-500">Premium Cut</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-primary-600 dark:text-primary-500">Success</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 mb-8 mt-4">
                    <div className="relative overflow-hidden bg-white/30 dark:bg-black/20 backdrop-blur-md border border-primary-500/20 rounded-2xl p-6 border-l-4 border-l-primary-500">
                        <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl"></div>
                        <div className="relative z-10 flex flex-col">
                            <h4 className="text-primary-600 dark:text-primary-500 font-bold text-lg leading-tight mb-2">Referral Reward</h4>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-5 leading-relaxed">Share the beauty. Get 15% off your next wholesale bulk order when you refer a partner.</p>
                            <div className="flex items-center gap-2">
                                <div className="bg-white/50 dark:bg-black/40 border border-dashed border-primary-500/50 rounded-lg px-4 py-2.5 flex-1">
                                    <span className="text-sm font-mono font-bold text-foreground">FLORAL-B2B-15</span>
                                </div>
                                <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs shadow-sm active:scale-95 transition-all">Copy</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 flex flex-col gap-3">
                    <Link href="/shop/orders" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] transition-all flex items-center justify-center gap-2">
                        View Order Details
                    </Link>
                    <Link href="/shop/browse" className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-foreground font-bold py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div >
    )
}
