'use client'

import { signIn } from '@/lib/actions/auth'
import Link from 'next/link'
import { useState, useTransition } from 'react'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        const formData = new FormData(e.currentTarget)
        startTransition(async () => {
            const result = await signIn(formData)
            if (result?.error) {
                setError(result.error)
            }
        })
    }

    return (
        <>
            <div className="mb-8">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">Welcome Back</h3>
                <p className="text-zinc-500 dark:text-zinc-400">Please enter your details to sign in.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-900/50 flex items-center gap-3 animate-enter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                    {error}
                </div>
            )}

            <form className="space-y-5" onSubmit={onSubmit} suppressHydrationWarning>
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Business Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                        </div>
                        <input id="email" name="email" type="email" required className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-zinc-900 dark:text-zinc-100 placeholder-zinc-400" placeholder="name@company.com" />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="password" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Password</label>
                        <a href="#" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 hover:underline">Forgot password?</a>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        </div>
                        <input id="password" name="password" type="password" required className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-zinc-900 dark:text-zinc-100 placeholder-zinc-400" placeholder="••••••••" />
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-1 pb-2">
                    <input id="remember" type="checkbox" className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-primary-600 focus:ring-primary-500 bg-white dark:bg-zinc-900" />
                    <label htmlFor="remember" className="text-sm text-zinc-600 dark:text-zinc-400 font-medium cursor-pointer">Keep me signed in for 30 days</label>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 sm:py-3.5 rounded-xl shadow-lg shadow-primary-600/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span>Signing In...</span>
                        </>
                    ) : (
                        <>
                            <span>Sign In to Market</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center">
                <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">
                    Don't have a business account?
                    <Link href="/signup" className="text-primary-600 dark:text-primary-400 font-bold hover:underline hover:text-primary-700 ml-1.5 transition-colors">
                        Create Account
                    </Link>
                </p>
            </div>
        </>
    )
}
