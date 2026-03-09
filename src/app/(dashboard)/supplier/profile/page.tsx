import { getFullProfile, updateProfile } from '@/lib/actions/profiles'
import { redirect } from 'next/navigation'
import { ProfileForm } from '../../shop/profile/ProfileForm'

export default async function SupplierProfilePage() {
    const profile = await getFullProfile()

    if (!profile) redirect('/login')
    if (profile.role !== 'supplier') redirect('/shop')

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account and business information</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Account Info Card */}
                <div className="glass border border-slate-200/60 dark:border-zinc-800/60 rounded-2xl p-6 col-span-full">
                    <div className="flex items-center gap-5 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-bold uppercase">
                            {profile.full_name?.charAt(0) || 'S'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{profile.full_name || 'Supplier'}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{profile.email}</p>
                            <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Supplier Partner
                            </span>
                        </div>
                    </div>

                    <ProfileForm
                        fullName={profile.full_name || ''}
                        updateProfile={updateProfile}
                    />
                </div>

                {/* Business Info Card */}
                <div className="glass border border-slate-200/60 dark:border-zinc-800/60 rounded-2xl p-6 col-span-full">
                    <h3 className="text-sm font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-4">Business Details</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-xs text-slate-400 dark:text-slate-500 font-medium">Business Name</dt>
                            <dd className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{profile.businessProfile?.business_name || '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-slate-400 dark:text-slate-500 font-medium">Contact Email</dt>
                            <dd className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{profile.businessProfile?.contact_email || '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-slate-400 dark:text-slate-500 font-medium">Phone</dt>
                            <dd className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{profile.businessProfile?.phone_number || '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-slate-400 dark:text-slate-500 font-medium">Address</dt>
                            <dd className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{profile.businessProfile?.address || '—'}</dd>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-6 text-center">
                Partner since {new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
    )
}
