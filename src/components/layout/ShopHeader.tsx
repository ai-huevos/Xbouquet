import Link from 'next/link'
import { getProfile } from '@/lib/actions/profiles'

export default async function ShopHeader() {
    const profile = await getProfile()

    return (
        <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-3">
            <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8">
                <div className="flex items-center gap-3 shrink-0">
                    <Link href="/shop" className="flex items-center gap-3">
                        <div className="bg-primary-500 p-2 rounded-lg text-white dark:text-zinc-950 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400">
                            Xpress Buke <span className="text-primary-500 font-medium text-sm">B2B</span>
                        </h1>
                    </Link>
                </div>

                <div className="flex-1 max-w-2xl relative hidden md:block">
                    <form action="/shop/browse" className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input name="q" className="w-full pl-12 pr-4 py-2.5 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 text-sm" placeholder="Search bulk flowers, suppliers, or seasons..." type="search" />
                    </form>
                </div>

                <div className="flex items-center gap-4 shrink-0 overflow-x-auto no-scrollbar">
                    <nav className="flex items-center gap-4 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                        <Link className="hover:text-primary-500 transition-colors whitespace-nowrap" href="/shop/browse">Marketplace</Link>
                        <Link className="hover:text-primary-500 transition-colors whitespace-nowrap" href="/shop/orders">Orders</Link>
                    </nav>
                    <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></div>

                    <div className="flex items-center gap-4">
                        <Link href="/shop/cart" className="relative p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-600 dark:text-zinc-300 group">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 group-hover:text-primary-500 transition-colors">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                        </Link>

                        <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
                            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold uppercase overflow-hidden">
                                {profile?.full_name?.charAt(0) || 'U'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
