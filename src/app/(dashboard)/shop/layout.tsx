import ShopHeader from '@/components/layout/ShopHeader'

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 min-h-screen flex flex-col">
            <ShopHeader />
            <div className="flex-1 flex">
                {children}
            </div>
        </div>
    )
}
