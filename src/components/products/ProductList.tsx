'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FlowerProductWithCategory } from '@/types/products'
import { deleteProduct } from '@/lib/actions/products'

interface ProductListProps {
    products: FlowerProductWithCategory[]
}

export function ProductList({ products }: ProductListProps) {
    const [isPending, startTransition] = useTransition()

    function handleDelete(id: string) {
        if (confirm('Are you sure you want to delete this product?')) {
            startTransition(async () => {
                await deleteProduct(id)
            })
        }
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <h3 className="text-xl font-medium text-white mb-2">No products yet</h3>
                <p className="text-gray-400 mb-6">Start by adding your first flower listing to the marketplace.</p>
                <Link
                    href="/supplier/products/new"
                    className="inline-block px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition shadow-lg shadow-purple-500/25"
                >
                    Add Product
                </Link>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
                <div key={product.id} className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition duration-300 shadow-xl">
                    <div className="relative h-48 bg-gray-900">
                        {product.image_url ? (
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover group-hover:scale-105 transition duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                        )}
                        <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-md bg-black/50 ${product.status === 'active' ? 'text-green-400' :
                                product.status === 'draft' ? 'text-yellow-400' : 'text-gray-400'
                                }`}>
                                {product.status.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-xs font-medium text-purple-400 mb-1">{product.category?.name || 'Uncategorized'}</p>
                                <h3 className="text-lg font-semibold text-white truncate" title={product.name}>{product.name}</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-white">${product.price_per_unit}</p>
                                <p className="text-xs text-gray-400">/ unit</p>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-sm">
                            <span className="text-gray-300">
                                Stock: <span className="text-white font-medium">{product.stock_qty}</span>
                            </span>

                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link
                                    href={`/supplier/products/${product.id}/edit`}
                                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded transition"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    disabled={isPending}
                                    className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded transition"
                                >
                                    Del
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
