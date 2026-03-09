# Xpress Buke

B2B flower marketplace. Suppliers list flowers, shops order them.

## Stack
- Next.js 15 (App Router, RSC, Server Actions)
- TypeScript strict
- Supabase (Auth, Postgres, Storage, RLS)
- Stripe Checkout (session-based payments)
- Tailwind CSS v4
- Zod validation
- Playwright (E2E testing)
- Vercel hosting

## Documentation (5 files in `/docs`)
- `ARCHITECTURE.md` — Core MVP source of truth (schema, RLS, page map, components)
- `DECISIONS.md` — Architectural Decision Records (16 ADRs)
- `PLAN.md` — Mission tracker (19 completed, next: M32)
- `GROWTH.md` — Future growth systems (frozen until real users validate MVP)
- `LESSONS.md` — Accumulated learnings from past missions

## Core Loop (SHIPPED — functional end-to-end)
```
Auth → Profiles → Product CRUD → Bulk Import → Marketplace Browse → Cart → Checkout (Stripe) → Order Fulfillment → Quality Claims
```
Core tables: profiles, supplier_profiles, shop_profiles, product_categories,
flower_products, cart_items, order_groups, orders, order_items, claims

B2B extensions: box_type (QB/HB/FB), order_type (one_time/pre_book/standing),
payment_terms (cod/net_15/net_30/put_on_account), credit_limit, current_balance

## Growth Systems — DO NOT BUILD YET
Documented in `docs/GROWTH.md`. Not to be touched until:
1. 5 real suppliers onboarded
2. 10 real shops onboarded
3. 20+ real orders completed

## File Conventions
- Server Actions: `src/lib/actions/{domain}.ts`
- Validators: `src/lib/validators/{domain}.ts`
- Supabase clients: `src/lib/supabase/server.ts`, `client.ts`, `middleware.ts`
- Stripe client: `src/lib/stripe.ts`
- Auth middleware: `src/proxy.ts` (Next.js 15.2+ proxy pattern)
- Pages: `src/app/(dashboard)/{role}/{feature}/page.tsx`
- Checkout: `src/app/checkout/{gateway,payment,success}/page.tsx`
- Components: `src/components/{domain}/{ComponentName}.tsx`
- Migrations: `supabase/migrations/{YYYYMMDDNNNNNN}_{description}.sql`

## ADW Workflows (`.agents/workflows/`)
- `/adw-start` — Read docs, pull dev, implement mission
- `/adw-finish` — Typecheck, browser verify, capture lessons, commit, update PLAN.md
- `/feature` — Plan a feature, generate implementation plan, append to PLAN.md

## Rules
- Roles: `supplier` | `shop` (immutable, set at signup)
- RLS on every table, no exceptions
- Server Actions for all mutations
- Read files before editing them
- Validate with Zod at system boundaries
- Prefer server components; client components only for interactivity
- Never trust client role state
- Feature branches only, never commit to main directly
- No schema changes without migration file
- No scope expansion — build what's specified, nothing more
