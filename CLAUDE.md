# Xpress Buke

B2B flower marketplace. Suppliers list flowers, shops order them.

## Stack
- Next.js 15 (App Router, RSC, Server Actions)
- TypeScript strict
- Supabase (Auth, Postgres, Storage, RLS)
- Tailwind CSS v4
- Zod validation
- Vercel hosting

## Architecture
- MVP source of truth: `/docs/ARCHITECTURE.md` (core only)
- Growth systems (frozen, future): `/docs/GROWTH_ARCHITECTURE_V2.md`
- Decision log: `/docs/DECISIONS.md`
- Roles: `supplier` | `shop` (immutable, set at signup)
- RLS on every table, no exceptions
- Server Actions for all mutations (no API routes)
- All DB access via Supabase client (no raw SQL in app code)

## Core Loop (the ONLY thing to build now)
```
Auth → Profiles → Product CRUD → Marketplace Browse → Cart → Checkout → Order Fulfillment
```
Core tables: profiles, supplier_profiles, shop_profiles, product_categories,
flower_products, cart_items, order_groups, orders, order_items

## Growth Systems — DO NOT BUILD YET
Documented in `/docs/GROWTH_ARCHITECTURE_V2.md`. Not to be touched until:
1. 5 real suppliers onboarded
2. 10 real shops onboarded
3. 20+ real orders completed

First growth feature to add: Drops only. Not tiers, not badges, not referrals.

## File Conventions
- Server Actions: `src/lib/actions/{domain}.ts`
- Validators: `src/lib/validators/{domain}.ts`
- Pages: `src/app/(dashboard)/{role}/{feature}/page.tsx`
- Migrations: `supabase/migrations/{NNN}_{description}.sql`

## Rules
- No real-time, no messaging, no notifications (future phases)
- No scope expansion — build what's specified, nothing more
- No growth system code until core MVP is shipped and validated with real users
- Feature branches only, never commit to main directly
- Read files before editing them
- Validate with Zod at system boundaries
- Prefer server components; client components only for interactivity
