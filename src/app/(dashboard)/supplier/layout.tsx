import { getProfile } from "@/lib/actions/profiles"
import Link from "next/link"
import { signOut } from "@/lib/actions/auth"
import { SupplierNav } from "@/components/supplier/SupplierNav"

export default async function SupplierLayout({
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
                        <div className="p-2 bg-primary-500 rounded-lg shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-emerald-950">
                                <path fillRule="evenodd" d="M11.583 3.635a.695.695 0 011.053-.058 10.1 10.1 0 012.384 3.327 7.042 7.042 0 012.1-.384 10.082 10.082 0 014.249.957.695.695 0 01.328.847l-1.01 2.92a.695.695 0 01-.848.437l-2.937-.807a.695.695 0 01-.482-1.025c.34-.698.814-1.323 1.39-1.848a8.675 8.675 0 00-3.32-.61 5.565 5.565 0 00-1.846.366c.214 1.139-.029 2.373-.835 3.385l-1.724 2.155a3.178 3.178 0 00-.638 2.067l.104 1.458c0 .012 0 .025.002.037.245 4.095 3.313 7.553 7.394 8.283a.695.695 0 01.536.877l-.608 2.434a.695.695 0 01-.885.498 11.565 11.565 0 01-7.85-8.498l-.168-1.01a.695.695 0 01.761-.806l1.374.23a4.678 4.678 0 002.94-.486l1.821-1.093c.895-.537 1.258-1.683.791-2.617l-.805-1.61a.695.695 0 011.242-.622l.806 1.611c.907 1.815.19 4.06-1.554 5.105l-1.82 1.093a6.177 6.177 0 01-3.882.64l-1.374-.23a2.195 2.195 0 00-2.404 2.545l.168 1.011a10.065 10.065 0 006.84 7.399l.607-2.432a2.195 2.195 0 00-1.69-2.68l-.497-.107c-.49-.105-1.006-.067-1.482.115a.695.695 0 01-.498-1.298c.642-.246 1.336-.297 1.996-.153l.497.106c1.61.346 2.68 1.94 2.38 3.593l-.853 3.414a.695.695 0 01-.885.498 13.064 13.064 0 01-8.877-9.613l-.105-1.46c-.002-.027-.002-.054-.001-.081a4.678 4.678 0 01.942-3.04l1.724-2.155c.571-.714.733-1.61.516-2.441a7.063 7.063 0 012.338-.46c1.17 0 2.32.221 3.407.653A11.575 11.575 0 009.282 3.86a.695.695 0 01-.19-.942l1.666-2.5a.695.695 0 01.825-.283zm-6.852 3.73a.695.695 0 01-.849.438l-2.937-.807a.695.695 0 01-.482-1.026c.34-.698.814-1.323 1.39-1.848a8.675 8.675 0 00-3.32-.61c-1.157 0-2.296.22-3.366.643a.695.695 0 01-.885-.497L-.005 1.54A.695.695 0 01.88.948a10.076 10.076 0 014.15-.815 10.176 10.176 0 013.913.784c-.58.528-1.055 1.155-1.398 1.85a.695.695 0 01-.48.11l-2.334.22zm2.062 1.488a.695.695 0 01.297.905c-.322.618-.49 1.306-.49 2.01v.784a.695.695 0 11-1.39 0v-.783c0-1.062.253-2.096.738-3.04a.695.695 0 01.845-.303z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold leading-none text-foreground">FloraB2B</h1>
                            <p className="text-xs text-zinc-500 font-medium">Supplier Portal</p>
                        </div>
                    </div>
                    <SupplierNav />
                </div>

                <div className="mt-auto p-6 space-y-4">
                    <form action={signOut} className="w-full">
                        <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all text-sm font-semibold">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                            Logout
                        </button>
                    </form>
                    <Link href="/supplier/profile" className="glass border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex items-center gap-3 bg-white/50 dark:bg-black/20 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-cover bg-primary-100 flex items-center justify-center text-primary-700 font-bold" title={profile?.full_name ?? 'Supplier'}>
                            {profile?.full_name?.charAt(0) ?? 'S'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate text-foreground">{profile?.full_name ?? 'Supplier'}</p>
                            <p className="text-xs text-zinc-500 truncate">Premium Partner</p>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-br from-zinc-50 to-emerald-50/30 dark:from-zinc-950 dark:to-emerald-950/10">
                {children}
            </main>
        </div>
    )
}
