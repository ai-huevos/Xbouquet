'use client'

import { useActionState } from 'react'

interface ProfileFormProps {
    fullName: string
    updateProfile: (formData: FormData) => Promise<{ error?: string; success?: boolean }>
}

export function ProfileForm({ fullName, updateProfile }: ProfileFormProps) {
    const [state, formAction, isPending] = useActionState(
        async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
            return await updateProfile(formData)
        },
        null
    )

    return (
        <form action={formAction} className="flex items-end gap-3">
            <div className="flex-1">
                <label htmlFor="full_name" className="block text-xs text-slate-400 dark:text-slate-500 font-medium mb-1.5">
                    Display Name
                </label>
                <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    defaultValue={fullName}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Your name"
                />
            </div>
            <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 whitespace-nowrap"
            >
                {isPending ? 'Saving...' : 'Update Name'}
            </button>
            {state?.success && (
                <span className="text-xs text-primary-600 font-medium whitespace-nowrap">✓ Saved</span>
            )}
            {state?.error && (
                <span className="text-xs text-rose-500 font-medium whitespace-nowrap">Error: {state.error}</span>
            )}
        </form>
    )
}
