import { signOut } from '@/lib/actions/auth'
import { getProfile } from '@/lib/actions/profiles'

export default async function SupplierDashboard() {
    const profile = await getProfile()

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Supplier Dashboard</h1>
            <p className="mt-4">Welcome, {profile?.full_name}</p>

            <form action={signOut} className="mt-8">
                <button type="submit" className="text-red-600 hover:text-red-800 font-medium">Log out</button>
            </form>
        </div>
    )
}
