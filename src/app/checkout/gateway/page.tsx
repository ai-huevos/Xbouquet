import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
    title: 'Checkout | Xpress Buke'
}

export default async function CheckoutGatewayPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Bypass gateway if user is already authenticated
    if (user) {
        redirect('/checkout/payment')
    }

    return (
        <div className="flex-1 px-4 sm:px-6 py-8 md:py-12 space-y-8 h-full bg-gradient-to-b from-primary-500/5 to-transparent max-w-md mx-auto">
            <header className="text-center space-y-2">
                <div className="inline-flex items-center justify-center p-3 bg-primary-500/10 rounded-full mb-2 text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c4.97-1.5 8-5.5 8-10.5V5l-8-3-8 3v6.5C4 16.5 7.03 20.5 12 22Z" /></svg>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Floral Market B2B</h1>
                <p className="text-zinc-500 text-sm">Secure checkout for floral professionals</p>
            </header>

            {/* Returning Customers Section */}
            <section className="glass-panel bg-white/70 dark:bg-zinc-900/70 border border-primary-500/10 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                    <h3 className="text-lg font-bold text-foreground">Returning Customers</h3>
                </div>
                <div className="space-y-4">
                    <Link href="/login?redirect=/checkout/payment" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2">
                        <span>Sign in to Account</span>
                    </Link>
                    <p className="text-center text-sm text-zinc-500">
                        Experience faster checkout and personalized pricing.
                    </p>
                </div>
            </section>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
                <span className="flex-shrink mx-4 text-zinc-400 text-xs font-bold uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>

            {/* Guest Checkout Section */}
            <section className="glass-panel bg-white/70 dark:bg-zinc-900/70 border border-primary-500/10 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    <h3 className="text-lg font-bold text-foreground">Guest Checkout</h3>
                </div>
                <p className="text-zinc-500 text-sm mb-6">No account? No problem. Checkout faster as a guest.</p>
                <Link href="/checkout/payment" className="w-full bg-white dark:bg-zinc-950 border-2 border-primary-600 text-primary-600 hover:bg-primary-500/5 font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2">
                    <span>Continue as Guest</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </Link>
            </section>

            <div className="text-center pb-12">
                <p className="text-zinc-400 text-xs">By continuing, you agree to our <Link href="#" className="underline">Terms of Service</Link></p>
            </div>
        </div>
    )
}
