import Image from 'next/image'
import Link from 'next/link'
import { FlowerProductWithSupplier } from '@/types/products'

export default function MarketplaceProductCard({ product }: { product: FlowerProductWithSupplier }) {
    return (
        <div className="glass-panel group rounded-2xl overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all duration-300 flex flex-col h-full relative">
            <Link href={`/shop/browse/${product.id}`} className="absolute inset-0 z-10">
                <span className="sr-only">View {product.name}</span>
            </Link>

            <div className="aspect-[4/5] relative overflow-hidden bg-zinc-100 dark:bg-zinc-800/50">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-zinc-400 dark:text-zinc-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                    </div>
                )}
                <div className="absolute top-3 left-3 z-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 shadow-sm">
                    {product.category?.name || 'Standard'}
                </div>
                {product.stock_qty <= 5 && product.stock_qty > 0 && (
                    <div className="absolute top-3 right-3 z-20 rounded bg-orange-500/90 backdrop-blur-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                        Only {product.stock_qty} left
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1 relative z-20 bg-white/30 dark:bg-zinc-950/30">
                <div className="mb-4">
                    <h4 className="font-bold text-lg mb-0.5 line-clamp-1 text-foreground">{product.name}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>
                        {product.supplier?.business_name || 'Unknown Supplier'}
                    </p>
                </div>

                <div className="mt-auto flex items-end justify-between">
                    <div>
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-wider mb-1">Price per unit</p>
                        <p className="text-xl font-extrabold text-zinc-900 dark:text-white leading-none">
                            ${(product.price_per_unit / 100).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
