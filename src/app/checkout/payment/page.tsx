import { checkout, createAccountOrder } from '@/lib/actions/orders'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'

export default async function PaymentProcessorPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('shop_profiles')
        .select('credit_limit, current_balance, payment_terms')
        .eq('profile_id', (await supabase.from('profiles').select('id').eq('user_id', user.id).single()).data?.id)
        .single()

    const { data: cartItems } = await supabase
        .from('cart_items')
        .select(`
            quantity,
            product:flower_products ( price_per_unit )
        `)
        .eq('shop_id', (await supabase.from('profiles').select('id').eq('user_id', user.id).single()).data?.id)

    const cartTotal = cartItems?.reduce((total, item) => {
        const product = item.product as any;
        return total + (product.price_per_unit * item.quantity);
    }, 0) || 0;

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-[calc(100vh-4rem)] w-full animate-enter">
            <nav className="flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500 mb-8">
                <Link href="/shop/cart" className="hover:text-primary-600 dark:hover:text-primary-500 transition-colors">Cart</Link>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
                <span className="text-foreground font-medium">Checkout</span>
            </nav>

            <CheckoutForm
                cartTotal={cartTotal}
                creditLimit={profile?.credit_limit || 0}
                currentBalance={profile?.current_balance || 0}
                paymentTerms={profile?.payment_terms || 'due_on_receipt'}
                stripeAction={checkout}
                accountAction={createAccountOrder}
            />
        </main>
    )
}
