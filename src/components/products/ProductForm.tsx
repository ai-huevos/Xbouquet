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
        <form onSubmit={onSubmit} className="max-w-2xl mx-auto space-y-8 bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold text-white">
                        {isEditing ? 'Edit Product' : 'New Product'}
                    </h2>
                    <p className="text-gray-400 mt-1">
                        {isEditing ? 'Update your flower listing details below.' : 'Add a new flower to your inventory.'}
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            defaultValue={initialData?.name}
                            className="w-full px-4 py-2 bg-white/5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                            placeholder="E.g., Red Roses Batch"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-300">Category</label>
                        <select
                            name="category_id"
                            id="category_id"
                            required
                            defaultValue={initialData?.category_id}
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        >
                            <option value="">Select a category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="price_per_unit" className="block text-sm font-medium text-gray-300">Price per Unit ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="price_per_unit"
                            id="price_per_unit"
                            required
                            min="0.01"
                            defaultValue={initialData?.price_per_unit}
                            className="w-full px-4 py-2 bg-white/5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="stock_qty" className="block text-sm font-medium text-gray-300">Stock Quantity</label>
                        <input
                            type="number"
                            name="stock_qty"
                            id="stock_qty"
                            required
                            min="0"
                            defaultValue={initialData?.stock_qty}
                            className="w-full px-4 py-2 bg-white/5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            rows={3}
                            defaultValue={initialData?.description || ''}
                            className="w-full px-4 py-2 bg-white/5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition placeholder-gray-400"
                            placeholder="Describe the flower, origins, stem length..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                        <select
                            name="status"
                            id="status"
                            defaultValue={initialData?.status || 'active'}
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        >
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300">Product Image</label>
                        <div className="flex items-center space-x-6">
                            {imageUrl && (
                                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/10">
                                    <Image
                                        src={imageUrl}
                                        alt="Product preview"
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20 transition cursor-pointer"
                                />
                                {uploading && <p className="mt-2 text-sm text-purple-400 animate-pulse">Uploading...</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => router.push('/supplier/products')}
                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending || uploading}
                    className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition disabled:opacity-50"
                >
                    {isPending ? 'Saving...' : 'Save Product'}
                </button>
            </div>
        </form>
    )
}
