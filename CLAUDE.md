# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What Is This

B2B flower marketplace. Suppliers list flowers, shops order them.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build (also serves as typecheck)
npm run lint         # ESLint (flat config, eslint.config.mjs)
npx tsc --noEmit     # Typecheck only (strict mode)

# E2E tests (Playwright, Chromium only)
npx playwright test                    # Run all tests (auto-starts dev server)
npx playwright test e2e/checkout.spec.ts  # Run single test file
npx playwright test --headed           # Run with browser visible
```

No unit test framework is configured — testing is E2E via Playwright (`e2e/` directory).

## Stack

- Next.js 16 (App Router, RSC, Server Actions, React Compiler enabled)
- TypeScript strict, path alias `@/*` → `./src/*`
- Supabase (Auth, Postgres, Storage, RLS on every table)
- Stripe Checkout (session-based payments)
- Tailwind CSS v4, Zod v4 validation
- Playwright E2E, Vercel hosting

## Architecture

### Auth & Middleware

Auth uses the Next.js 15.2+ proxy pattern — NOT `middleware.ts`. The middleware entry point is `src/proxy.ts`, which calls `src/lib/supabase/middleware.ts` to refresh the Supabase session, then handles role-based routing:
- Unauthenticated users → `/login`
- Authenticated users on auth pages → `/{role}` dashboard
- Role mismatch (shop accessing `/supplier` or vice versa) → redirected to correct role path

### Server Actions Pattern

All mutations go through Server Actions in `src/lib/actions/{domain}.ts`. Each action file:
1. Starts with `'use server'`
2. Creates a Supabase client via `createClient()` from `@/lib/supabase/server.ts`
3. Gets the authenticated user via `supabase.auth.getUser()`
4. Validates input with Zod schemas from `src/lib/validators/{domain}.ts`
5. Calls `revalidatePath()` after mutations

Action domains: auth, products, cart, orders, claims, profiles, admin, analytics, billing, communications, dashboard.

### Route Groups

- `(auth)` — Login/signup pages
- `(dashboard)/supplier/*` — Supplier-only pages (products, orders, analytics)
- `(dashboard)/shop/*` — Shop-only pages (marketplace, cart, orders)
- `(dashboard)/admin/*` — Admin pages
- `checkout/*` — Stripe checkout flow (gateway → payment → success)

### Database

16 migrations in `supabase/migrations/`. Core tables: profiles, supplier_profiles, shop_profiles, product_categories, flower_products, cart_items, order_groups, orders, order_items, claims.

B2B-specific fields: `box_type` (QB/HB/FB), `order_type` (one_time/pre_book/standing), `payment_terms` (cod/net_15/net_30/put_on_account), `credit_limit`, `current_balance`.

Types are in `src/types/products.ts`. No generated Supabase types — types are manually defined.

## Documentation

5 files in `/docs` — read these before major changes:
- `ARCHITECTURE.md` — Schema, RLS policies, page map, components (source of truth)
- `DECISIONS.md` — 16 ADRs
- `PLAN.md` — Mission tracker
- `LESSONS.md` — Past learnings

## ADW Workflows

`.agents/workflows/` contains autonomous development workflows: `adw-start`, `adw-finish`, `adw-bugfix`, `adw-parallel`, `adw-resume`, `adw-audit`, `adw-metrics`, `feature`.

## Rules

- Roles: `supplier` | `shop` (immutable, set at signup via auth trigger)
- RLS on every table, no exceptions
- Server Actions for all mutations — no direct client-side Supabase writes
- Validate with Zod at system boundaries
- Prefer server components; client components only for interactivity
- Never trust client role state — always verify via `supabase.auth.getUser()`
- Feature branches only, never commit to main directly
- No schema changes without a migration file in `supabase/migrations/`
- No scope expansion — build what's specified, nothing more

## Growth Systems — DO NOT BUILD

Documented in `docs/GROWTH.md`. Frozen until: 5 real suppliers, 10 real shops, 20+ real orders completed.
