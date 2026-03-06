import { signOut } from '@/lib/actions/auth'
import { getProfile } from '@/lib/actions/profiles'
import Link from 'next/link'

export default async function SupplierDashboard() {
    const profile = await getProfile()

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-enter">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Supplier Dashboard</h1>
                <p className="mt-2 text-zinc-500 dark:text-zinc-400">Welcome back, {profile?.full_name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-8 flex flex-col items-start space-y-4 transition-glass hover:-translate-y-1">
                    <h2 className="text-xl font-semibold text-foreground">Your Products</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">Manage your flower inventory, add new items, and track your listings on the marketplace.</p>
                    <Link
                        href="/supplier/products"
                        className="mt-auto px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                        Go to Products &rarr;
                    </Link>
                </div>
            </div>

            <form action={signOut} className="pt-8 border-t border-border">
                <button type="submit" className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-medium transition-colors cursor-pointer">Log out</button>
            </form>
        </div>
    )
}
