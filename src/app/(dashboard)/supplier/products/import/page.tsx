import { getCategories } from '@/lib/actions/products'
import { ImportFlow } from '@/components/supplier/ImportFlow'

export const metadata = {
    title: 'Bulk Import | Xpress Buke Supplier',
    description: 'Import products via CSV',
}

export default async function ImportProductsPage() {
    const categories = await getCategories()

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Import Products</h1>
                <p className="mt-2 text-sm text-gray-700">
                    Upload a CSV file to bulk import products into your catalog.
                </p>
            </div>

            <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6 text-gray-900">
                <ImportFlow categories={categories} />
            </div>
        </div>
    )
}
