'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'

interface CheckoutFormProps {
    cartTotal: number
    creditLimit: number
    currentBalance: number
    paymentTerms: string
    stripeAction: (formData: FormData) => Promise<any>
    accountAction: (formData: FormData) => Promise<any>
}

function SubmitButton({ isAccount, disabled }: { isAccount: boolean, disabled: boolean }) {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending || disabled}
            className={`w-full flex justify-center items-center gap-2 rounded-xl px-4 py-4 font-bold text-white text-lg transition-all shadow-lg 
                ${pending || disabled
                    ? 'bg-zinc-400 cursor-not-allowed shadow-none'
                    : isAccount
                        ? 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5'
                        : 'bg-primary-600 hover:bg-primary-700 active:scale-95 shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-0.5'
                }`}
        >
            {pending ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </>
            ) : isAccount ? (
                <>Put on Account ({paymentTermsFormatter(null)})</>
            ) : (
                <>Pay Securely with Card</>
            )}
        </button>
    )
}

function paymentTermsFormatter(terms: string | null) {
    if (terms === 'net_15') return 'Net 15';
    if (terms === 'net_30') return 'Net 30';
    if (terms === 'net_60') return 'Net 60';
    return 'Due on Receipt';
}

export function CheckoutForm({ cartTotal, creditLimit, currentBalance, paymentTerms, stripeAction, accountAction }: CheckoutFormProps) {
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'account'>('card')
    const [orderType, setOrderType] = useState<'immediate' | 'prebook' | 'standing'>('immediate')
    const [deliveryDate, setDeliveryDate] = useState('')

    const availableCredit = Math.max(0, creditLimit - currentBalance)
    const canUseAccount = paymentTerms !== 'due_on_receipt' && availableCredit >= (cartTotal / 100)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Checkout Steps */}
            <div className="lg:col-span-8 space-y-8">
                <div className="flex items-baseline justify-between mb-2">
                    <h2 className="text-4xl font-extrabold text-foreground tracking-tight">Delivery Logistics</h2>
                </div>

                <section className="glass border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">
                    <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-primary-600 dark:text-primary-500"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                        <h3 className="text-xl font-bold text-foreground tracking-tight">Order Type & Schedule</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Order Type</label>
                            <select
                                value={orderType}
                                onChange={(e) => setOrderType(e.target.value as any)}
                                className="mt-1.5 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            >
                                <option value="immediate">Immediate Delivery</option>
                                <option value="prebook">Pre-book (Future Date)</option>
                                <option value="standing">Standing Order (Recurring)</option>
                            </select>
                        </div>

                        {(orderType === 'prebook' || orderType === 'standing') && (
                            <div className="animate-enter">
                                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Requested Delivery Date</label>
                                <input
                                    type="date"
                                    value={deliveryDate}
                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                    // Required conditionally
                                    required
                                    className="mt-1.5 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                />
                                {orderType === 'standing' && <p className="text-xs text-zinc-500 mt-2">First delivery date for recurring standing order. Frequency details will be arranged by supplier.</p>}
                            </div>
                        )}
                    </div>
                </section>

                <section className="glass border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">
                    <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-primary-600 dark:text-primary-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
                        <h3 className="text-xl font-bold text-foreground tracking-tight">Payment Method</h3>
                    </div>

                    <div className="space-y-4">
                        <label className={`flex items-start gap-4 p-4 rounded-xl border ${paymentMethod === 'card' ? 'border-primary-500 bg-primary-500/5' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'} cursor-pointer transition-all`}>
                            <input
                                type="radio"
                                name="payment_method"
                                value="card"
                                checked={paymentMethod === 'card'}
                                onChange={() => setPaymentMethod('card')}
                                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-zinc-300"
                            />
                            <div>
                                <h4 className="font-bold text-foreground">Credit Card (Stripe)</h4>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Pay securely via Stripe. Available to everyone.</p>
                            </div>
                        </label>

                        <label className={`flex items-start gap-4 p-4 rounded-xl border ${paymentMethod === 'account' ? 'border-primary-500 bg-primary-500/5' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'} ${paymentTerms === 'due_on_receipt' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} transition-all`}>
                            <input
                                type="radio"
                                name="payment_method"
                                value="account"
                                disabled={paymentTerms === 'due_on_receipt'}
                                checked={paymentMethod === 'account'}
                                onChange={() => setPaymentMethod('account')}
                                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-zinc-300 disabled:opacity-50"
                            />
                            <div className="w-full">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-foreground">Put on Account</h4>
                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/30 px-2 py-1 rounded">{paymentTermsFormatter(paymentTerms)}</span>
                                </div>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Draw against your approved wholesale credit limit.</p>

                                {paymentTerms !== 'due_on_receipt' && (
                                    <div className="mt-4 p-3 bg-zinc-100 dark:bg-zinc-950 rounded-lg flex justify-between text-sm">
                                        <span className="text-zinc-600 dark:text-zinc-400">Available Credit:</span>
                                        <span className={`font-bold ${!canUseAccount ? 'text-red-500' : 'text-foreground'}`}>
                                            ${availableCredit.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                {paymentTerms === 'due_on_receipt' && (
                                    <p className="text-xs text-red-500 mt-2">B2B Terms not approved for this account.</p>
                                )}
                                {!canUseAccount && paymentTerms !== 'due_on_receipt' && paymentMethod === 'account' && (
                                    <p className="text-xs text-red-500 mt-2">Order exceeds available credit. Please pay by card.</p>
                                )}
                            </div>
                        </label>
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
                            <span className="font-bold text-foreground">${(cartTotal / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                            <span className="font-medium">Tax (B2B Exemption)</span>
                            <span className="font-bold text-foreground">$0.00</span>
                        </div>
                        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-baseline">
                            <span className="text-xl font-bold text-foreground">Total Due</span>
                            <span className="text-3xl font-extrabold text-primary-600 dark:text-primary-500">${(cartTotal / 100).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <form action={async (formData) => {
                            formData.append('order_type', orderType)
                            if (deliveryDate) formData.append('requested_delivery_date', deliveryDate)

                            if (paymentMethod === 'card') {
                                await stripeAction(formData)
                            } else {
                                await accountAction(formData)
                            }
                        }}>
                            <SubmitButton isAccount={paymentMethod === 'account'} disabled={paymentMethod === 'account' && !canUseAccount} />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
