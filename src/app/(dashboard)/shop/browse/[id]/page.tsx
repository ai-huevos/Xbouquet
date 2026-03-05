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
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
            <div className="mx-auto max-w-6xl">
                <Link
                    href="/shop/browse"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    Back to Marketplace
                </Link>

                <div className="grid overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:grid-cols-2">
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
                            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                                No image available
                            </div>
                        )}
                        <div className="absolute top-6 left-6 inline-flex items-center rounded-full bg-white/80 px-4 py-1.5 text-sm font-semibold text-gray-900 backdrop-blur-md shadow-sm">
                            {product.category?.name || 'Uncategorized'}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col p-8 md:p-12 lg:p-16">
                        <div className="mb-2">
                            <span className="text-sm font-medium text-gray-500">Provided by</span>
                            <span className="ml-2 inline-block font-semibold text-rose-500">
                                {product.supplier?.business_name || 'Unknown Supplier'}
                            </span>
                        </div>

                        <h1 className="mb-6 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
                            {product.name}
                        </h1>

                        <div className="mb-8 flex items-end gap-3">
                            <div className="text-5xl font-black text-gray-900">
                                ${(product.price_per_unit / 100).toFixed(2)}
                            </div>
                            <div className="mb-1 text-lg font-medium text-gray-500">per unit</div>
                        </div>

                        <div className="prose prose-gray mb-10 max-w-none text-gray-600">
                            <p>{product.description || 'No detailed description available for this product.'}</p>
                        </div>

                        <div className="mt-auto border-t border-gray-100 pt-8">
                            <div className="mb-6 flex items-center justify-between">
                                <span className="font-medium text-gray-900">Availability</span>
                                {product.stock_qty > 0 ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                        {product.stock_qty} in stock
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">
                                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                        Out of stock
                                    </span>
                                )}
                            </div>

                            <AddToCartForm productId={product.id} stockQty={product.stock_qty} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
