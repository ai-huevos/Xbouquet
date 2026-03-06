import { signOut } from '@/lib/actions/auth'
import { getProfile } from '@/lib/actions/profiles'

export default async function ShopDashboard() {
    const profile = await getProfile()

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-enter">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Shop Dashboard</h1>
                <p className="mt-2 text-zinc-500 dark:text-zinc-400">Welcome back, {profile?.full_name}</p>
            </div>

            <form action={signOut} className="pt-8 border-t border-border">
                <button type="submit" className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-medium transition-colors cursor-pointer">Log out</button>
            </form>
        </div>
    )
}
