/**
 * Xpress Buke REST API — Supabase Edge Function
 * 
 * "Blueprint First, Model Second"
 * 
 * Routes:
 *   /v1/auth/*        — signup, signin, signout, refresh
 *   /v1/products/*    — CRUD + bulk + image upload
 *   /v1/cart/*        — shop cart operations
 *   /v1/orders/*      — order listing, detail, status updates
 *   /v1/claims/*      — quality claims create/resolve
 *   /v1/profiles/*    — profile get/update
 *   /v1/dashboard/*   — supplier KPI stats + orders
 */

import { Hono } from 'hono'
import { corsMiddleware } from './middleware/cors.ts'

// Route modules
import auth from './routes/auth.ts'
import products from './routes/products.ts'
import cart from './routes/cart.ts'
import orders from './routes/orders.ts'
import claims from './routes/claims.ts'
import profiles from './routes/profiles.ts'
import dashboard from './routes/dashboard.ts'

const app = new Hono().basePath('/api')

// ── Global middleware ────────────────────────────────────────────────
app.use('*', corsMiddleware)

// ── Health check ─────────────────────────────────────────────────────
app.get('/health', (c) => {
    return c.json({
        status: 'ok',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    })
})

// ── Mount routes ─────────────────────────────────────────────────────
app.route('/v1/auth', auth)
app.route('/v1/products', products)
app.route('/v1/cart', cart)
app.route('/v1/orders', orders)
app.route('/v1/claims', claims)
app.route('/v1/profiles', profiles)
app.route('/v1/dashboard', dashboard)

// ── 404 handler ──────────────────────────────────────────────────────
app.notFound((c) => {
    return c.json({ error: `Not found: ${c.req.method} ${c.req.url}` }, 404)
})

// ── Error handler ────────────────────────────────────────────────────
app.onError((err, c) => {
    console.error('Unhandled error:', err)
    return c.json({ error: 'Internal server error' }, 500)
})

// ── Start Deno server ────────────────────────────────────────────────
Deno.serve(app.fetch)
