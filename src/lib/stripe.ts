import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing. Please set the environment variable.')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2025-02-24.acacia',
    appInfo: {
        name: 'Xpress Buke',
        url: 'http://localhost:3000',
    },
})
