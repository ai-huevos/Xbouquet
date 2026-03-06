import Link from 'next/link'

export const metadata = {
    title: 'Checkout | Xpress Buke'
}

export default function CheckoutGatewayPage() {
    return (
        <div className="flex flex-col items-center justify-center p-6 md:p-12 min-h-[calc(100vh-4rem)]">
            <div className="w-full max-w-4xl animate-enter">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">How would you like to checkout?</h1>
                    <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">Choose the option that works best for you.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
                    {/* Guest Checkout Panel */}
                    <div className="glass-panel p-8 md:p-10 flex flex-col justify-between transition-glass relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-200/30 dark:bg-zinc-800/20 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 text-zinc-600 dark:text-zinc-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-3">Guest Checkout</h2>
                            <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                                Proceed directly to payment. You can always create an account later to track your order and earn referral rewards.
                            </p>
                        </div>
                        <div className="relative z-10">
                            <Link href="/checkout/payment" className="block w-full text-center rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-4 font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                                Continue as Guest
                            </Link>
                        </div>
                    </div>

                    {/* Login / Signup Panel */}
                    <div className="glass-panel p-8 md:p-10 flex flex-col justify-between transition-glass relative overflow-hidden group border-primary-500/30 dark:border-primary-500/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 dark:bg-primary-500/10 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/40 rounded-2xl flex items-center justify-center mb-6 text-primary-600 dark:text-primary-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                    <polyline points="10 17 15 12 10 7" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-3">Sign in or Create Account</h2>
                            <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                                Experience faster checkout, manage your subscriptions, and access exclusive wholesale marketplace pricing.
                            </p>
                        </div>
                        <div className="relative z-10 flex flex-col sm:flex-row gap-3">
                            <Link href="/login?redirect=/checkout/payment" className="flex-1 text-center rounded-xl bg-primary-600 px-6 py-4 font-bold text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 transition-all">
                                Sign In
                            </Link>
                            <Link href="/signup?redirect=/checkout/payment" className="flex-1 text-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-foreground px-6 py-4 font-semibold shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:-translate-y-0.5 transition-all">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
