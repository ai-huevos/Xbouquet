'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function SupplierNav() {
    const pathname = usePathname()

    const navItems = [
        {
            name: 'Overview',
            href: '/supplier',
            exact: true,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10 1a9 9 0 100 18 9 9 0 000-18zm-2 5a2 2 0 11-4 0 2 2 0 014 0zm0 8a2 2 0 11-4 0 2 2 0 014 0zm8-8a2 2 0 11-4 0 2 2 0 014 0zm0 8a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
                </svg>
            ),
        },
        {
            name: 'Products',
            href: '/supplier/products',
            exact: false,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10.5 1.5a.75.75 0 011.5 0v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0V6h-1.5a.75.75 0 010-1.5h1.5v-1.5zM3 8.25A1.25 1.25 0 014.25 7h11.5A1.25 1.25 0 0117 8.25v8.5A1.25 1.25 0 0115.75 18H4.25A1.25 1.25 0 013 16.75v-8.5z" />
                </svg>
            ),
        },
        {
            name: 'Orders',
            href: '/supplier/orders',
            exact: false,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 2a1 1 0 112 0 1 1 0 01-2 0zm6 0a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
                </svg>
            ),
        },
    ]

    return (
        <nav className="space-y-2">
            {navItems.map((item) => {
                const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href)

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all group ${isActive
                                ? 'bg-primary-500/20 text-foreground'
                                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                            }`}
                    >
                        <span className={`transition-colors ${isActive
                                ? 'text-primary-600 dark:text-primary-500 group-hover:scale-110 transition-transform'
                                : 'text-zinc-400 dark:text-zinc-500 group-hover:text-primary-600 dark:group-hover:text-primary-500'
                            }`}>
                            {item.icon}
                        </span>
                        <span>{item.name}</span>
                    </Link>
                )
            })}
        </nav>
    )
}
