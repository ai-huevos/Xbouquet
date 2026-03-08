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

## Architecture
- MVP source of truth: `/docs/ARCHITECTURE.md` (core only)
- Growth systems (frozen, future): `/docs/GROWTH_ARCHITECTURE_V2.md`
- Decision log: `/docs/DECISIONS.md` (16 ADRs)
- Agent Tracker: `/docs/PLAN.md` (Tracks the ADW missions — 14 completed, 3 pending)
- Roles: `supplier` | `shop` (immutable, set at signup)
- RLS on every table, no exceptions
- Server Actions for all mutations (no API routes except Stripe webhook)
- All DB access via Supabase client (no raw SQL in app code)

## Core Loop (SHIPPED — functional end-to-end)
```
Auth → Profiles → Product CRUD → Bulk Import → Marketplace Browse → Cart → Checkout (Stripe) → Order Fulfillment → Quality Claims
```
Core tables: profiles, supplier_profiles, shop_profiles, product_categories,
flower_products, cart_items, order_groups, orders, order_items, claims

B2B extensions: box_type (QB/HB/FB), order_type (one_time/pre_book/standing),
payment_terms (cod/net_15/net_30/put_on_account), credit_limit, current_balance

## Growth Systems — DO NOT BUILD YET
Documented in `/docs/GROWTH_ARCHITECTURE_V2.md`. Not to be touched until:
1. 5 real suppliers onboarded
2. 10 real shops onboarded
3. 20+ real orders completed

First growth feature to add: Drops only. Not tiers, not badges, not referrals.

## File Conventions
- Server Actions: `src/lib/actions/{domain}.ts` (auth, cart, claims, orders, products, profiles)
- Validators: `src/lib/validators/{domain}.ts` (import, products)
- Supabase clients: `src/lib/supabase/server.ts`, `client.ts`, `middleware.ts`
- Stripe client: `src/lib/stripe.ts`
- Auth middleware: `src/proxy.ts` (Next.js 15.2+ proxy pattern)
- Pages: `src/app/(dashboard)/{role}/{feature}/page.tsx`
- Checkout flow: `src/app/checkout/{gateway,payment,success}/page.tsx`
- Components: `src/components/{domain}/{ComponentName}.tsx`
- Migrations: `supabase/migrations/{YYYYMMDDNNNNNN}_{description}.sql`
- Seed photos: `public/seeds/`
- E2E tests: `e2e/`

## Key Components
- `ShopHeader` + `UserMenuDropdown` — Global shop navigation shell
- `SupplierNav` — Sidebar navigation for suppliers
- `ProductForm` — Shared product create/edit form
- `CheckoutForm` — Full checkout with payment method selection
- `AddToCartForm` / `CartItemControls` — Cart interactions
- `ImportFlow` / `ColumnMapper` / `CsvUploader` / `ImportReview` — Bulk CSV import pipeline

## Agentic Development Workflow (ADW)
Missions are tracked in `docs/PLAN.md`.
Execution details are in `docs/MVP_MISSIONS.md` and `docs/GROWTH_MISSIONS.md`.
Use custom slash commands for workflow triggers:
- `/adw-start [mission_number]`: Start development
- `/adw-finish`: Typecheck, format, commit, push to dev, and mark done in `docs/PLAN.md`.
- `/feature`: Plan a new feature in detail before execution.

## Rules
- **Hybrid Model**: Claude plan-first → Antigravity execution
- **Execution Mode**: Always use Review-Driven Mode. Never auto-accept. Keep missions thin and deterministic.
- No real-time, no messaging, no notifications (future phases)
- No scope expansion — build what's specified, nothing more
- No growth system code until core MVP is shipped and validated with real users
- Feature branches only, never commit to main directly
- **Testing**: End-to-end functionality must be verified visually via the `browser_subagent` and documented in a `walkthrough.md` on every `/adw-finish`.
- Read files before editing them
- Validate with Zod at system boundaries
- Prefer server components; client components only for interactivity
- All business logic server-side
- Never trust client role state
- Use Supabase RLS before public launch
- One feature per branch
- No schema changes without migration file

## Risk Map
1. **RLS misconfiguration** → catastrophic data leak. Mitigation: Write policy tests before launch.
2. **Marketplace cold start**. Mitigation: Manually onboard 10 suppliers first.
3. **Inventory mismatch**. Mitigation: Manual confirmation workflow initially.
4. **Scope creep**. Mitigation: If it doesn't improve supplier → order → reorder, cut it.
