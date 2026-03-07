'use client'

import { signUp } from '@/lib/actions/auth'
import Link from 'next/link'
import { useState, useTransition, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SignUpContent() {
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const searchParams = useSearchParams()
    const defaultRole = searchParams.get('role') || 'shop'

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        const formData = new FormData(e.currentTarget)
        startTransition(async () => {
            const result = await signUp(formData)
            if (result?.error) {
                setError(result.error)
            }
        })
    }

    return (
        <>
            <div className="mb-6">
                <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">Create Account</h3>
                <p className="text-zinc-500 dark:text-zinc-400">Join the FloraMarket B2B network today.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-900/50 flex items-center gap-3 animate-enter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                    {error}
                </div>
            )}

            <form className="space-y-4" onSubmit={onSubmit} suppressHydrationWarning>

                {/* Toggle Switch for Role */}
                <div className="flex bg-zinc-200/50 dark:bg-zinc-900/50 p-1 rounded-xl mb-6">
                    <label className="flex-1 cursor-pointer group">
                        <input className="peer hidden" name="role" type="radio" value="shop" defaultChecked={defaultRole === 'shop'} />
                        <div className="py-2.5 text-center rounded-lg text-sm font-bold transition-all peer-checked:bg-white dark:peer-checked:bg-zinc-800 peer-checked:shadow-sm text-zinc-500 peer-checked:text-zinc-900 dark:peer-checked:text-white hover:text-zinc-700 dark:hover:text-zinc-300">
                            Buyer (Shop)
                        </div>
                    </label>
                    <label className="flex-1 cursor-pointer group">
                        <input className="peer hidden" name="role" type="radio" value="supplier" defaultChecked={defaultRole === 'supplier'} />
                        <div className="py-2.5 text-center rounded-lg text-sm font-bold transition-all peer-checked:bg-white dark:peer-checked:bg-zinc-800 peer-checked:shadow-sm text-zinc-500 peer-checked:text-zinc-900 dark:peer-checked:text-white hover:text-zinc-700 dark:hover:text-zinc-300">
                            Supplier
                        </div>
                    </label>
                </div>

                <div>
                    <label htmlFor="full_name" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Full Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        </div>
                        <input id="full_name" name="full_name" type="text" required className="w-full pl-11 pr-4 py-3 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-zinc-900 dark:text-zinc-100 placeholder-zinc-400" placeholder="John Doe" />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Business Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                        </div>
                        <input id="email" name="email" type="email" required className="w-full pl-11 pr-4 py-3 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-zinc-900 dark:text-zinc-100 placeholder-zinc-400" placeholder="name@company.com" />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        </div>
                        <input id="password" name="password" type="password" required className="w-full pl-11 pr-4 py-3 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-zinc-900 dark:text-zinc-100 placeholder-zinc-400" placeholder="••••••••" />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-600/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isPending ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            <>
                                <span>Create Account</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center">
                <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">
                    Already have an account?
                    <Link href="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline hover:text-primary-700 ml-1.5 transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </>
    )
}

export default function SignUpPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading form...</div>}>
            <SignUpContent />
        </Suspense>
    )
}
