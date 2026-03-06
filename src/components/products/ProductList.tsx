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
            <div className="text-center py-20 glass-panel animate-enter">
                <h3 className="text-xl font-bold text-foreground mb-2">No products yet</h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">Start by adding your first flower listing to the marketplace.</p>
                <Link
                    href="/supplier/products/new"
                    className="inline-block px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                    Add Product
                </Link>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-enter" style={{ animationDelay: '100ms' }}>
            {products.map(product => (
                <div key={product.id} className="group glass-panel transition-glass hover:border-primary-500/30 overflow-hidden flex flex-col">
                    <div className="relative h-48 bg-zinc-100 dark:bg-zinc-800/50">
                        {product.image_url ? (
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover group-hover:scale-105 transition duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500">No Image</div>
                        )}
                        <div className="absolute top-3 right-3">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-background/80 shadow-sm border border-border backdrop-blur-md tracking-wide ${product.status === 'active' ? 'text-primary-600 dark:text-primary-500' :
                                product.status === 'draft' ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-500 dark:text-zinc-400'
                                }`}>
                                {product.status.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <div className="pr-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-500 mb-1">{product.category?.name || 'Uncategorized'}</p>
                                <h3 className="text-lg font-bold text-foreground line-clamp-1" title={product.name}>{product.name}</h3>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-lg font-black text-foreground">${product.price_per_unit}</p>
                                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">/ unit</p>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 flex items-center justify-between text-sm border-t border-border/50">
                            <span className="font-medium text-zinc-500 dark:text-zinc-400">
                                Stock: <span className="text-foreground">{product.stock_qty}</span>
                            </span>

                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all sm:opacity-100">
                                <Link
                                    href={`/supplier/products/${product.id}/edit`}
                                    className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-foreground font-medium rounded-lg transition-colors"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    disabled={isPending}
                                    className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-medium rounded-lg transition-colors cursor-pointer"
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
