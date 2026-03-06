'use client'

import { checkout } from '@/lib/actions/orders'
import { useFormStatus } from 'react-dom'

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
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] max-w-7xl mx-auto w-full p-6 md:p-12 gap-10">
            {/* Left Column: Forms */}
            <div className="flex-1 animate-enter space-y-8">
                {/* Contact Step */}
                <section className="glass-panel p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">1</div>
                        <h2 className="text-xl font-bold text-foreground">Contact Information</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Email Address (Optional)</label>
                            <input type="email" placeholder="We use Stripe to securely collect details" className="mt-1.5 w-full rounded-xl border border-input bg-zinc-100 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-500 cursor-not-allowed" disabled />
                        </div>
                    </div>
                </section>

                {/* Shipping Step */}
                <section className="glass-panel p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">2</div>
                        <h2 className="text-xl font-bold text-foreground">Shipping Address</h2>
                    </div>
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-400">
                        Shipping details will be securely collected via Stripe Checkout.
                    </div>
                </section>

                {/* Payment Step */}
                <section className="glass-panel p-6 md:p-8 border-2 border-primary-500/20 shadow-md">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-4 ring-primary-500/20">3</div>
                        <h2 className="text-xl font-bold text-foreground">Secure Payment</h2>
                        <div className="ml-auto text-zinc-400 flex gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                        </div>
                    </div>
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            You will be redirected to Stripe to securely complete your purchase.
                        </p>
                    </div>
                </section>
            </div>

            {/* Right Column: Order Summary & Pay */}
            <div className="lg:w-96 shrink-0">
                <div className="sticky top-24 glass-heavy p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-border">
                    <h2 className="text-xl font-bold text-foreground mb-6">Payment Summary</h2>

                    <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-medium text-foreground">Calculated...</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="font-medium text-foreground">Free</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Estimated Taxes</span>
                            <span className="font-medium text-foreground">$0.00</span>
                        </div>
                        <div className="border-t border-border pt-4 flex justify-between items-center">
                            <span className="text-base font-bold text-foreground">Total to Pay</span>
                            <span className="text-2xl font-black text-foreground">Pending</span>
                        </div>
                    </div>

                    <form action={async () => {
                        await checkout()
                    }} className="mt-8">
                        <CheckoutButton />
                    </form>

                    <div className="mt-6 flex items-start gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        <p>We process your payment securely via Stripe. Your card details are never stored on our servers.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
