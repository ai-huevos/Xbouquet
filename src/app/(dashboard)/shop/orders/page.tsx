import { getProfile } from '@/lib/actions/profiles'

export const metadata = {
    title: 'Your Orders | Xpress Buke',
}

export default async function ShopOrdersPage() {
    const profile = await getProfile()

    return (
        <div className="p-8 max-w-7xl mx-auto w-full animate-enter">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Order History</h2>
            <div className="glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-12 text-center rounded-2xl flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 text-primary-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Order Tracking Coming Soon</h3>
                <p className="text-zinc-500 max-w-md">You will be able to view your past purchases, track active shipments, and download invoices here very soon.</p>
            </div>
        </div>
    )
}
