import { getProfile } from "@/lib/actions/profiles"
import { signOut } from "@/lib/actions/auth"
import { AdminNav } from "@/components/admin/AdminNav"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const profile = await getProfile()

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
            {/* Sidebar */}
            <aside className="w-64 bg-white/10 dark:bg-black/20 backdrop-blur-2xl flex flex-col h-full z-20 border-r border-zinc-200/50 dark:border-zinc-800/50">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 15a.75.75 0 01-.75-.75V11.25a.75.75 0 011.5 0v5.25a.75.75 0 01-.75.75zm1-9V7.5a1 1 0 10-2 0v.75a1 1 0 102 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold leading-none text-foreground">FloraB2B</h1>
                            <p className="text-xs text-emerald-600 font-medium">Global Admin</p>
                        </div>
                    </div>
                    <AdminNav />
                </div>

                <div className="mt-auto p-6 space-y-4">
                    <form action={signOut} className="w-full">
                        <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all text-sm font-semibold">
                            Logout
                        </button>
                    </form>
                    <div className="glass border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex items-center gap-3 bg-white/50 dark:bg-black/20">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold" title={profile?.full_name ?? 'Admin'}>
                            {profile?.full_name?.charAt(0) ?? 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate text-foreground">{profile?.full_name ?? 'Admin'}</p>
                            <p className="text-xs text-zinc-500 truncate">Platform Administrator</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-br from-zinc-50 to-emerald-50/30 dark:from-zinc-950 dark:to-emerald-950/10">
                {children}
            </main>
        </div>
    )
}
