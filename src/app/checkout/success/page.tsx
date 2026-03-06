import Link from 'next/link'

export const metadata = {
    title: 'Order Successful | Xpress Buke'
}

export default function OrderSuccessPage() {
    return (
        <div className="flex flex-col items-center justify-center p-6 md:p-12 min-h-[calc(100vh-4rem)]">
            <div className="w-full max-w-3xl animate-enter">

                {/* Success Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-500 mb-6 shadow-sm border-4 border-white dark:border-zinc-950 ring-1 ring-primary-200 dark:ring-primary-900">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-4">
                        Thank you for your order!
                    </h1>
                    <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
                        Your wholesale order #XB-84920 has been placed successfully and sent to our partner farms.
                    </p>
                </div>

                {/* Founder Video Placeholder */}
                <div className="relative w-full aspect-video bg-zinc-900 rounded-3xl overflow-hidden mb-10 shadow-lg group">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579725942555-eaebd1c28f11?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-50 dark:opacity-40 transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />

                    <button className="absolute inset-0 m-auto w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-white/30 hover:scale-110 transition-all cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="ml-2">
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                    </button>

                    <div className="absolute bottom-6 left-6 right-6">
                        <p className="text-white font-semibold text-lg drop-shadow-md">A personal thank you from Juan, our Founder</p>
                        <p className="text-zinc-300 text-sm mt-1">Watch how your order helps local farm communities.</p>
                    </div>
                </div>

                {/* Referral Incentive Card */}
                <div className="glass-panel p-8 text-center bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20 border-primary-100 dark:border-primary-900/50 mb-10 shadow-sm relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-200/50 dark:bg-primary-800/30 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm text-primary-600 dark:text-primary-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15.4 19.46 1.28 1.28L21 16" /><path d="M21 8a2 2 0 0 0-1.41-.59h-.05a2 2 0 0 0-1.41 3.41 2 2 0 0 1-2.93 2.82l-2.02-2.02a2 2 0 0 1-.58-1.52A2 2 0 0 1 14 8.52V6a2 2 0 0 0-2-2" /></svg>
                    </div>

                    <h2 className="text-xl font-bold text-foreground mb-2">Give $50, Get $50</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md mx-auto">
                        Share your unique referral link with other florists. They get $50 off their first order, and you earn $50 in store credit.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <code className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-6 py-3 rounded-xl text-primary-600 dark:text-primary-500 font-mono font-bold tracking-wider select-all">
                            XPRESS-JB842
                        </code>
                        <button className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-xl font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm">
                            Copy Link
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/shop/orders" className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5text-center text-center">
                        View Order Details
                    </Link>
                    <Link href="/shop/browse" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-900 text-foreground border border-zinc-200 dark:border-zinc-800 rounded-xl font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm text-center">
                        Continue Shopping
                    </Link>
                </div>

            </div>
        </div>
    )
}
