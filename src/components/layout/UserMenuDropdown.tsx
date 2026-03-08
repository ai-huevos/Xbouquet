'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface UserMenuDropdownProps {
    initials: string
    fullName: string
    email: string
}

export default function UserMenuDropdown({ initials, fullName, email }: UserMenuDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const supabase = createClient()

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800 outline-none transition-transform active:scale-95 group"
                aria-expanded={isOpen}
            >
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold uppercase overflow-hidden border border-transparent group-hover:border-primary-200 dark:group-hover:border-primary-800/50 transition-colors">
                    {initials}
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-zinc-800 overflow-hidden transform origin-top-right transition-all animate-enter z-[100]">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800/50 bg-slate-50 dark:bg-zinc-900/50">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{fullName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{email}</p>
                    </div>

                    <div className="py-2">
                        <Link
                            href="/shop/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="material-symbols-outlined text-[20px]">person</span>
                            My Profile
                        </Link>
                        <Link
                            href="/shop/orders"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                            Order History
                        </Link>
                        <Link
                            href="/shop/claims"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="material-symbols-outlined text-[20px]">support_agent</span>
                            Quality Claims
                        </Link>
                    </div>

                    <div className="py-2 border-t border-slate-100 dark:border-zinc-800/50">
                        <button
                            onClick={() => {
                                setIsOpen(false)
                                handleSignOut()
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-left"
                        >
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                            Log Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
