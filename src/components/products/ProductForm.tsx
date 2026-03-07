'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct, updateProduct, uploadProductImage } from '@/lib/actions/products'
import { ProductCategory, FlowerProduct } from '@/types/products'
import Image from 'next/image'

interface ProductFormProps {
    categories: ProductCategory[]
    initialData?: FlowerProduct
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [imageUrl, setImageUrl] = useState<string>(initialData?.image_url || '')
    const [uploading, setUploading] = useState(false)

    const isEditing = !!initialData

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setError(null)
        const formData = new FormData()
        formData.append('image', file)

        const res = await uploadProductImage(formData)
        if (res.error) {
            setError(res.error)
        } else if (res.url) {
            setImageUrl(res.url)
        }
        setUploading(false)
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)

        const formData = new FormData(e.currentTarget)
        const values = {
            name: formData.get('name') as string,
            category_id: formData.get('category_id') as string,
            description: formData.get('description') as string,
            price_per_unit: Number(formData.get('price_per_unit')),
            stock_qty: Number(formData.get('stock_qty')),
            image_url: imageUrl,
            status: formData.get('status') as 'active' | 'draft' | 'archived',
            box_type: (formData.get('box_type') as 'QB' | 'HB' | 'FB') || null,
            stems_per_bunch: formData.get('stems_per_bunch') ? Number(formData.get('stems_per_bunch')) : null,
            stem_length_cm: formData.get('stem_length_cm') ? Number(formData.get('stem_length_cm')) : null,
        }

        startTransition(async () => {
            const res = isEditing && initialData
                ? await updateProduct(initialData.id, values)
                : await createProduct(values)

            if (res.error) {
                setError(res.error)
            } else {
                router.push('/supplier/products')
            }
        })
    }

    return (
        <div className="w-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/60 dark:border-zinc-800/60 shadow-2xl rounded-3xl overflow-hidden">
            <div className="p-8 md:p-12">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 text-primary-600 dark:text-primary-500 text-sm font-semibold uppercase tracking-wider mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                        Supplier Portal
                    </div>
                    <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
                        {isEditing ? 'Edit Floral Product' : 'Add New Floral Product'}
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                        {isEditing ? 'Update your flower listing details below.' : 'List your fresh blooms on the global B2B floral network.'}
                    </p>
                    {error && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-600 dark:text-red-400 font-medium">
                            {error}
                        </div>
                    )}
                </div>

                {/* Form Grid */}
                <form onSubmit={onSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Left Column: Details */}
                        <div className="space-y-6">
                            <div className="group">
                                <label htmlFor="name" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    required
                                    defaultValue={initialData?.name}
                                    className="w-full bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-foreground rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400"
                                    placeholder="e.g. Premium Blue Hydrangea"
                                />
                            </div>

                            <div className="group">
                                <label htmlFor="category_id" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Category</label>
                                <div className="relative">
                                    <select
                                        name="category_id"
                                        id="category_id"
                                        required
                                        defaultValue={initialData?.category_id}
                                        className="w-full bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-foreground rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="group">
                                    <label htmlFor="price_per_unit" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Price per Unit</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="price_per_unit"
                                            id="price_per_unit"
                                            required
                                            min="0.01"
                                            defaultValue={initialData?.price_per_unit}
                                            className="w-full bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-foreground rounded-xl pl-8 pr-4 py-3.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label htmlFor="stock_qty" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Stock Quantity</label>
                                    <input
                                        type="number"
                                        name="stock_qty"
                                        id="stock_qty"
                                        required
                                        min="0"
                                        defaultValue={initialData?.stock_qty}
                                        className="w-full bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-foreground rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400"
                                        placeholder="Units available"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label htmlFor="status" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Status</label>
                                <div className="relative">
                                    <select
                                        name="status"
                                        id="status"
                                        defaultValue={initialData?.status || 'active'}
                                        className="w-full bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-foreground rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none"
                                    >
                                        <option value="active">Active</option>
                                        <option value="draft">Draft</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Packaging Logistics */}
                            <div className="pt-4 border-t border-zinc-200/50 dark:border-zinc-700/50">
                                <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-primary-500"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0v9l-9 5.25m9-14.25v9l9 5.25m-9-14.25l-9 5.25M3 7.5v9l9 5.25L3 7.5m0-14.25l9 5.25l9-5.25M12 12.75l9-5.25v9l-9-5.25" /></svg>
                                    B2B Packaging Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="group">
                                        <label htmlFor="box_type" className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Box Type</label>
                                        <div className="relative">
                                            <select
                                                name="box_type"
                                                id="box_type"
                                                defaultValue={initialData?.box_type || ''}
                                                className="w-full bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-foreground rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none text-sm"
                                            >
                                                <option value="">Select Box</option>
                                                <option value="QB">Quarter Box (QB)</option>
                                                <option value="HB">Half Box (HB)</option>
                                                <option value="FB">Full Box (FB)</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-zinc-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label htmlFor="stems_per_bunch" className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Stems / Bunch</label>
                                        <input
                                            type="number"
                                            name="stems_per_bunch"
                                            id="stems_per_bunch"
                                            min="1"
                                            defaultValue={initialData?.stems_per_bunch || ''}
                                            className="w-full bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-foreground rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 text-sm"
                                            placeholder="e.g. 10"
                                        />
                                    </div>

                                    <div className="group">
                                        <label htmlFor="stem_length_cm" className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Length (cm)</label>
                                        <input
                                            type="number"
                                            name="stem_length_cm"
                                            id="stem_length_cm"
                                            min="1"
                                            defaultValue={initialData?.stem_length_cm || ''}
                                            className="w-full bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-foreground rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 text-sm"
                                            placeholder="e.g. 50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Image Upload */}
                        <div className="flex flex-col h-full">
                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Product Gallery</label>
                            <div className="relative flex-1 flex flex-col items-center justify-center border-2 border-dashed border-primary-500/40 bg-primary-500/5 rounded-2xl p-8 text-center group hover:border-primary-500/80 transition-all overflow-hidden min-h-[300px]">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt="Product preview"
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <>
                                        <div className="bg-primary-500/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-emerald-600 dark:text-primary-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Drag & Drop Product Images</h3>
                                        <p className="text-zinc-500 text-sm mt-1 mb-6">Support JPEG, PNG, WEBP (Max 10MB)</p>
                                        <div className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-6 py-2 rounded-lg font-bold text-sm shadow-sm border border-zinc-200 dark:border-zinc-700 transition-colors pointer-events-none">
                                            Browse Files
                                        </div>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                    title="Upload product image"
                                />
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                                        <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <p className="text-white font-bold animate-pulse">Uploading...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Full Width: Description */}
                    <div className="group">
                        <label htmlFor="description" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Detailed Description</label>
                        <textarea
                            name="description"
                            id="description"
                            rows={4}
                            defaultValue={initialData?.description || ''}
                            className="w-full bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-foreground rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none placeholder:text-zinc-400"
                            placeholder="Provide details about freshness, stem length, origin, and care instructions..."
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-200/50 dark:border-zinc-700/50">
                        <button
                            type="button"
                            onClick={() => router.push('/supplier/products')}
                            className="px-8 py-3 rounded-xl font-bold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 border border-zinc-200 dark:border-zinc-700/40 backdrop-blur-sm transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || uploading}
                            className="px-10 py-3 rounded-xl font-bold text-emerald-950 bg-primary-500 hover:bg-emerald-400 shadow-lg shadow-primary-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
                        >
                            {isPending ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
