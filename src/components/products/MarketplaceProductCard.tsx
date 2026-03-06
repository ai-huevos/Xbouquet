import Image from 'next/image'
import Link from 'next/link'
import { FlowerProductWithSupplier } from '@/types/products'

export default function MarketplaceProductCard({ product }: { product: FlowerProductWithSupplier }) {
    return (
        <div className="group relative flex flex-col overflow-hidden glass-panel transition-glass hover:-translate-y-1">
            <Link href={`/shop/browse/${product.id}`} className="absolute inset-0 z-10">
                <span className="sr-only">View {product.name}</span>
            </Link>

            <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800/50">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-zinc-400">
                        No image
                    </div>
                )}
                {product.stock_qty <= 5 && product.stock_qty > 0 && (
                    <div className="absolute top-3 right-3 z-20 rounded-full bg-orange-100 dark:bg-orange-900/60 px-3 py-1 text-xs font-semibold text-orange-800 dark:text-orange-400 border border-orange-200 dark:border-orange-800 shadow-sm backdrop-blur-md">
                        Only {product.stock_qty} left
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-500">
                        {product.category?.name || 'Uncategorized'}
                    </span>
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        By {product.supplier?.business_name || 'Unknown'}
                    </span>
                </div>

                <h3 className="mb-2 text-lg font-bold text-foreground line-clamp-1">{product.name}</h3>

                <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 flex-1">
                    {product.description || 'No description available.'}
                </p>

                <div className="mt-auto flex items-end justify-between">
                    <div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-500">Price per unit</p>
                        <p className="text-2xl font-black text-foreground tracking-tight">
                            ${(product.price_per_unit / 100).toFixed(2)}
                        </p>
                    </div>

                    <button className="z-20 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white transition-all shadow-sm hover:bg-primary-500 hover:shadow-md hover:scale-110 active:scale-95 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" /><path d="M12 5v14" />
                        </svg>
                        <span className="sr-only">Add to Cart</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
