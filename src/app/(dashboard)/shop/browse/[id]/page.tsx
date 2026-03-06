import { getProduct } from '@/lib/actions/products'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { AddToCartForm } from '@/components/cart/AddToCartForm'

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }) {
    const resolvedParams = await params
    const product = await getProduct(resolvedParams.id)
    if (!product) return { title: 'Product Not Found | Xpress Buke' }
    return { title: `${product.name} | Xpress Buke` }
}

export default async function ProductDetailPage({
    params
}: {
    params: Params
}) {
    const resolvedParams = await params
    const product = await getProduct(resolvedParams.id)

    if (!product) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-500/10 dark:bg-primary-900/20 blur-[120px] rounded-full point-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-primary-300/10 dark:bg-primary-800/20 blur-[120px] rounded-full point-events-none" />
            <div className="mx-auto max-w-6xl relative z-10 animate-enter">
                <Link
                    href="/shop/browse"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-foreground transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    Back to Marketplace
                </Link>

                <div className="grid overflow-hidden rounded-[2rem] glass-panel lg:grid-cols-2">
                    {/* Image Section */}
                    <div className="relative aspect-square w-full lg:aspect-auto">
                        {product.image_url ? (
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                                No image available
                            </div>
                        )}
                        <div className="absolute top-6 left-6 inline-flex items-center rounded-full glass px-4 py-1.5 text-sm font-semibold text-foreground">
                            {product.category?.name || 'Uncategorized'}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col p-8 md:p-12 lg:p-16">
                        <div className="mb-2">
                            <span className="text-sm font-medium text-zinc-500">Provided by</span>
                            <span className="ml-2 inline-block font-semibold text-primary-600 dark:text-primary-500">
                                {product.supplier?.business_name || 'Unknown Supplier'}
                            </span>
                        </div>

                        <h1 className="mb-6 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                            {product.name}
                        </h1>

                        <div className="mb-8 flex items-end gap-3">
                            <div className="text-5xl font-black text-foreground">
                                ${(product.price_per_unit / 100).toFixed(2)}
                            </div>
                            <div className="mb-1 text-lg font-medium text-zinc-500">per unit</div>
                        </div>

                        <div className="prose prose-zinc dark:prose-invert mb-8 max-w-none text-zinc-600 dark:text-zinc-400">
                            <p>{product.description || 'No detailed description available for this product.'}</p>
                        </div>

                        {/* GEO/SEO Conversational Attributes */}
                        <div className="mb-10 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6">
                            <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Product Attributes</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                                    <span className="w-32 font-medium text-zinc-900 dark:text-zinc-200">Vase Life</span>
                                    <span>10-14 days</span>
                                </li>
                                <li className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                                    <span className="w-32 font-medium text-zinc-900 dark:text-zinc-200">Bloom Stage</span>
                                    <span>2 (Closed)</span>
                                </li>
                                <li className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                                    <span className="w-32 font-medium text-zinc-900 dark:text-zinc-200">Stem Length</span>
                                    <span>50cm - 60cm</span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-auto md:border-t md:border-border md:pt-8 relative mb-24 md:mb-0">
                            <div className="mb-6 flex items-center justify-between">
                                <span className="font-medium text-foreground">Availability</span>
                                {product.stock_qty > 0 ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 dark:bg-primary-950/50 px-3 py-1 text-sm font-semibold text-primary-800 dark:text-primary-400 shadow-sm border border-primary-200 dark:border-primary-900">
                                        <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
                                        {product.stock_qty} in stock
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-950/50 px-3 py-1 text-sm font-semibold text-red-800 dark:text-red-400 shadow-sm border border-red-200 dark:border-red-900">
                                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                        Out of stock
                                    </span>
                                )}
                            </div>

                            {/* Mobile Sticky / Desktop Inline Cart Add */}
                            <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel md:relative md:glass-none border-t border-zinc-200/50 dark:border-zinc-800/50 md:border-none p-4 md:p-0 rounded-t-3xl md:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:shadow-none">
                                <AddToCartForm productId={product.id} stockQty={product.stock_qty} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
