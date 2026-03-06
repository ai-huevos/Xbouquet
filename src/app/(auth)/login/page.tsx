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
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-50/50 via-zinc-50 to-zinc-50 dark:from-primary-950/20 dark:via-zinc-950 dark:to-zinc-950">
            <div className="max-w-md w-full space-y-8 glass-panel shadow-primary-900/5 p-8 transition-glass">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground tracking-tight">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
                        Or{' '}
                        <Link href="/signup" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                            create a new account
                        </Link>
                    </p>
                </div>
                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900 animate-enter">
                        {error}
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input id="email-address" name="email" type="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-input placeholder-zinc-400 text-foreground bg-transparent rounded-t-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm transition-colors" placeholder="Email address" />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input id="password" name="password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-input placeholder-zinc-400 text-foreground bg-transparent rounded-b-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm transition-colors" placeholder="Password" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" disabled={isPending} className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-0.5">
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Signing in...
                                </span>
                            ) : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
