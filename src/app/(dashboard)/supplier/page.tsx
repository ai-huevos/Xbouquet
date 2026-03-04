import { signOut } from '@/lib/actions/auth'
import { getProfile } from '@/lib/actions/profiles'
import Link from 'next/link'

export default async function SupplierDashboard() {
    const profile = await getProfile()

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Supplier Dashboard</h1>
                <p className="mt-2 text-gray-600">Welcome back, {profile?.full_name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Your Products</h2>
                    <p className="text-gray-600 text-sm">Manage your flower inventory, add new items, and track your listings on the marketplace.</p>
                    <Link
                        href="/supplier/products"
                        className="mt-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Go to Products &rarr;
                    </Link>
                </div>
            </div>

            <form action={signOut} className="pt-8 border-t border-gray-200">
                <button type="submit" className="text-red-600 hover:text-red-800 font-medium">Log out</button>
            </form>
        </div>
    )
}
