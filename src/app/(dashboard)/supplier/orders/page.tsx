import { getProfile } from '@/lib/actions/profiles'

export const metadata = {
    title: 'Supplier Orders | Xpress Buke',
}

export default async function SupplierOrdersPage() {
    const profile = await getProfile()

    return (
        <div className="p-8 max-w-7xl mx-auto w-full animate-enter">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Order Management</h2>
            <div className="glass border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-12 text-center rounded-2xl flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 text-primary-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.315 48.315 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Order Fulfillment Coming Soon</h3>
                <p className="text-zinc-500 max-w-md">Our logistics integration is currently in development. You will be able to manage shipping statuses and waybills here.</p>
            </div>
        </div>
    )
}
