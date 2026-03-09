import { Context, Next } from 'hono'

const ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://xpress-buke.vercel.app',
    // Add your production domain here
]

/**
 * CORS middleware — allows requests from the Next.js frontend.
 */
export async function corsMiddleware(c: Context, next: Next) {
    const origin = c.req.header('Origin') || ''
    const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app')

    // Handle preflight
    if (c.req.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': isAllowed ? origin : '',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Requested-With',
                'Access-Control-Max-Age': '86400',
            },
        })
    }

    await next()

    // Set CORS headers on response
    if (isAllowed) {
        c.res.headers.set('Access-Control-Allow-Origin', origin)
        c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
        c.res.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With')
    }
}
