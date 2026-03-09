# Xpress Buke — B2B Flower Marketplace

A two-sided B2B marketplace where suppliers list rare, exclusive flowers, and boutique shops browse and place wholesale orders.

## Tech Stack
- **Framework**: Next.js 15 (App Router, RSC, Server Actions)
- **Language**: TypeScript (strict)
- **Database/Auth**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **Payments**: Stripe Checkout
- **Styling**: Tailwind CSS v4
- **Testing**: Playwright (E2E)

## Features (Current)
- **Auth & Roles**: Email/password signup with immutable role selection (supplier or shop)
- **Supplier Dashboard**: Product CRUD, bulk CSV import, order management, quality claims resolution
- **Shop Marketplace**: Browse products, add to cart, checkout flow (Stripe), order history, claim submission
- **B2B Logistics**: Box types (QB/HB/FB), order types (one-time/pre-book/standing), payment terms (COD/Net-15/Net-30)
- **Quality Claims**: Tied to order items with evidence photo uploads and credit resolution
- **Premium UI**: Glassmorphism aesthetics, mobile-responsive layouts, sticky nav shells, local floral seed imagery

## Documentation (`/docs` — 5 files, flat)
- `ARCHITECTURE.md` — Core MVP schema, RLS policies, page map, component map
- `DECISIONS.md` — 16 architectural decision records
- `PLAN.md` — Mission tracker (19 completed)
- `GROWTH.md` — Future growth systems (frozen)
- `LESSONS.md` — Accumulated learnings from past missions

## Agentic Development Workflow (ADW)
This project is built using a deterministic AI handoff strategy ("101 Dev Sessions"). 

To manage missions with the AI agent:
- `/adw-start [mission_number]` — Sets up the environment, pulls latest from `dev`, reads architecture, and starts implementing the mission slice.
- `/adw-finish` — Runs typechecking (`tsc --noEmit`), commits the work, pushes to `dev`, runs browser verification, and updates `PLAN.md`.
- `/feature` — Plans a new feature in detail (UI, schema, backend) and generates an implementation plan for approval.

## Development Setup
1. Clone the repo and `npm install`
2. Link Supabase: `npx supabase link --project-ref <your-ref>`
3. Set up `.env.local` with Supabase + Stripe keys
4. Run the development server:
```bash
npm run dev
```

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login & signup
│   ├── (dashboard)/        # Supplier & shop dashboards
│   ├── checkout/           # Gateway → payment → success
│   └── api/                # Stripe webhook
├── components/             # Reusable UI components
│   ├── cart/               # AddToCartForm, CartItemControls
│   ├── checkout/           # CheckoutForm
│   ├── layout/             # ShopHeader, UserMenuDropdown
│   ├── products/           # ProductForm, ProductList, MarketplaceProductCard
│   └── supplier/           # CSV import pipeline, SupplierNav
├── lib/
│   ├── actions/            # Server Actions (auth, cart, claims, orders, products, profiles)
│   ├── supabase/           # DB clients (server, client, middleware)
│   ├── validators/         # Zod schemas (import, products)
│   └── stripe.ts           # Stripe client
└── types/                  # TypeScript type definitions
supabase/migrations/        # 13 SQL migration files
docs/                       # Architecture, decisions, plan, lessons
e2e/                        # Playwright E2E tests
```
