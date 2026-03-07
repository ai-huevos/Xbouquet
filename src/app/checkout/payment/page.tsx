'use client'

import { checkout } from '@/lib/actions/orders'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'

function CheckoutButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full flex justify-center items-center gap-2 rounded-xl px-4 py-4 font-bold text-white text-lg transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] 
                ${pending
                    ? 'bg-primary-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 active:scale-95 hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5'
                }`}
        >
            {pending ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Redirecting to Stripe...
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    Pay Securely with Stripe
                </>
            )}
        </button>
    )
}

export default function PaymentProcessorPage() {
    return (
        <main className="max-w-7xl mx-auto px-6 py-12 min-h-[calc(100vh-4rem)] w-full animate-enter">
            <nav className="flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500 mb-8">
                <Link href="/shop/cart" className="hover:text-primary-600 dark:hover:text-primary-500 transition-colors">Cart</Link>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
                <span className="text-foreground font-medium">Checkout</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Checkout Steps */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-baseline justify-between mb-2">
                        <h2 className="text-4xl font-extrabold text-foreground tracking-tight">Secure Checkout</h2>
                    </div>

                    <section className="glass border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">
                        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-primary-600 dark:text-primary-500"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                            <h3 className="text-xl font-bold text-foreground tracking-tight">Contact Information</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Email Address</label>
                                <input type="email" placeholder="Required for order updates" className="mt-1.5 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950/50 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" />
                            </div>
                        </div>
                    </section>

                    <section className="glass border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">
                        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-primary-600 dark:text-primary-500"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                            <h3 className="text-xl font-bold text-foreground tracking-tight">Shipping</h3>
                            <span className="ml-auto text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-100/50 dark:bg-primary-900/30 px-2 py-1 rounded">Stripe Secure</span>
                        </div>
                        <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/50 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-400">
                            Full shipping details will be securely collected during the final Stripe checkout step to ensure B2B accuracy.
                        </div>
                    </section>
                </div>

                {/* Right Column: Order Summary (Sticky) */}
                <div className="lg:col-span-4">
                    <div className="glass bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl rounded-3xl p-8 sticky top-28 space-y-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 dark:border-zinc-700/30">
                        <h3 className="text-2xl font-extrabold text-foreground tracking-tight border-b border-zinc-200 dark:border-zinc-800 pb-4">Order Summary</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                                <span className="font-medium">Subtotal</span>
                                <span className="font-bold text-foreground">Calculated...</span>
                            </div>
                            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                                <span className="font-medium">Tax (B2B Exemption)</span>
                                <span className="font-bold text-foreground">Pending</span>
                            </div>
                            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                                <span className="font-medium">Standard Ground Shipping</span>
                                <span className="font-bold text-foreground">Free</span>
                            </div>
                            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-baseline">
                                <span className="text-xl font-bold text-foreground">Total Due</span>
                                <span className="text-3xl font-extrabold text-primary-600 dark:text-primary-500">Pending</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-primary-500/5 rounded-2xl p-4 border border-primary-500/10 dark:border-primary-500/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-primary-600 dark:text-primary-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Estimated Delivery</span>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Orders typically ship within 24-48 hours via Cold-Chain Express.</p>
                            </div>

                            <form action={async () => {
                                await checkout()
                            }}>
                                <CheckoutButton />
                            </form>

                            <div className="flex items-center justify-center gap-6 pt-4">
                                <div className="flex items-center gap-1.5 grayscale opacity-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">SSL Encrypted</span>
                                </div>
                                <div className="flex items-center gap-1.5 grayscale opacity-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M2.879 7.121A3 3 0 007.5 6.66a2.997 2.997 0 002.5 1.34 2.997 2.997 0 002.5-1.34 3 3 0 104.622-3.78l-.293-.292a4.12 4.12 0 00-5.83 0L10 3.61l-.999-.999a4.12 4.12 0 00-5.83 0l-.293.292a3 3 0 000 4.218zM10 18c-4.418 0-8-3.582-8-8H4c0 3.314 2.686 6 6 6s6-2.686 6-6h2c0 4.418-3.582 8-8 8z" /></svg>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Payment Secure</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
