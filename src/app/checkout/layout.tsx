import Link from 'next/link'
import { getProfile } from '@/lib/actions/profiles'

export const metadata = {
    title: 'Secure Checkout | Xpress Buke'
}

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
    await getProfile()

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col pt-safe pb-safe selection:bg-primary-500/30">
            {/* Minimal Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 px-4 sm:px-6 h-16 flex items-center justify-between shadow-sm">
                <Link href="/shop/cart" className="text-sm font-medium text-zinc-500 hover:text-foreground transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    Back to Cart
                </Link>
                <div className="font-bold text-lg text-foreground tracking-tight">Xpress <span className="text-primary-600">Buke</span></div>
                <div className="text-sm font-medium text-zinc-500 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Secure
                </div>
            </header>

            {/* Main Checkout Area */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
