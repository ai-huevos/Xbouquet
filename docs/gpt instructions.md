Perfect.

You’re **EXPERT + Hybrid (Claude plan-first → Antigravity execution)**.

That means:

* We design architecture properly.
* We generate a real CLAUDE.md.
* We use plan mode before writing code.
* We keep Antigravity missions thin and deterministic.
* We enforce RLS + server boundaries from day one.
* No drift. No vibe chaos.

Now we proceed correctly.

---

# PHASE 2 — DECOMPOSE (Validated + Tightened)

Your breakdown is strong. I’m tightening it for production safety.

## 1️⃣ Core Value Loop (Validated)

Supplier → List Flower
Shop → Browse
Shop → Order
Supplier → Fulfill
Shop → Reorder

But here’s the real atomic loop:

> Supplier creates inventory → Shop converts to order → Supplier sees demand → Repeat

If suppliers don’t see demand clearly, the loop dies.

So supplier dashboard visibility is part of the MVP, not a later add.

---

## 2️⃣ Dependency Graph (True Order)

Here’s the correct dependency chain:

Auth + Roles
↓
Profiles (SupplierProfile / ShopProfile)
↓
Product CRUD (supplier-scoped)
↓
Public Marketplace Browse
↓
Order Schema
↓
Order Creation (server-side only)
↓
Supplier Order Visibility
↓
Shop Order History

Stripe comes AFTER all of this.

RLS must exist BEFORE public launch (not after).

---

## 3️⃣ Promptable Chunks (Hybrid-Optimized)

We split responsibilities:

Claude Code → Architecture + Plan Mode
Antigravity → Feature Missions
Cursor (optional) → Refactors / UI refinement

Chunks:

1. Architecture Spec (Claude Plan Mode)
2. Auth + Role System
3. Supplier Product CRUD
4. Marketplace Browse
5. Order Creation Flow
6. Supplier + Shop Order Dashboards
7. RLS Hardening
8. Stripe Checkout

Each chunk = one clean execution session.

---

# PHASE 3 — AI-NATIVE SEQUENCE (Hybrid Optimized)

We now define which tool handles which phase.

---

# TOOL STRATEGY

### 🧠 Claude Code (Planning Authority)

* Creates architecture
* Defines DB schema
* Writes CLAUDE.md
* Generates implementation plan
* Produces RLS policy plan

### 🚀 Antigravity (Execution Engine)

* Implements scoped feature missions
* Builds UI + API per slice
* Review-driven mode ONLY

---

# PROJECT OVERVIEW

A two-sided B2B marketplace where:

Suppliers list rare, exclusive flowers.
Boutique shops browse and place wholesale orders.

Revenue later:

* 10–15% take rate OR
* Supplier subscription tier

Initial product goal:
Prove shops will place real B2B orders.

---

# TECH STACK (Hybrid-Optimized)

Frontend: Next.js 14 (App Router)
Backend: Supabase (Auth + Postgres + Storage)
Payments: Stripe (later)
Hosting: Vercel
Styling: Tailwind
Language: TypeScript strict

Why:

* Clean RBAC with Supabase RLS
* Easy server components
* Strong separation between client/server
* Antigravity performs well with this structure

---

# PHASE 0 — CLAUDE CODE PLAN MODE (MANDATORY FIRST)

You will run this in Claude Code plan mode.

---

## 🔵 PLAN MODE PROMPT (COPY THIS)

**Title:** B2B Flower Marketplace Architecture Plan

```
You are in PLAN MODE.

Do NOT write implementation code.
Return architecture plan only.

Goal:
Design the architecture for a two-sided B2B marketplace connecting flower suppliers with boutique flower shops.

Stack:
- Next.js 14 (App Router)
- Supabase (Auth + Postgres + Storage)
- TypeScript strict
- Tailwind
- Hosted on Vercel

User Roles:
- Supplier
- Shop
- Admin (internal only)

Core Entities:
- User (linked to Supabase auth)
- SupplierProfile
- ShopProfile
- FlowerProduct
- Order
- OrderItem

Constraints:
- Suppliers can CRUD only their own products.
- Shops can browse all products.
- Orders must link one Shop to one Supplier.
- All business logic server-side.
- RLS required before public launch.
- No payments yet.
- No messaging.
- No reviews.
- No subscriptions.
- No optimization.

Output Contract:
1. ERD (table definitions with fields + types)
2. Role model design
3. Folder structure
4. API route map
5. Page map
6. RLS policy design (written but not implemented)
7. Known risk areas
8. Blocking questions only

Do not write UI code.
Do not expand scope.
```

---

## DONE CRITERIA

You must receive:

* Clean schema
* Role separation model
* RLS draft policies
* Clear vertical slice plan

Only after that do we move.

---

# PHASE 1 — VERTICAL SLICE (ANTIGRAVITY MISSIONS)

Always: Review-Driven Mode.

Never: Auto-accept.

---

## 🚀 MISSION 1 — Auth + Roles

**Title:** Implement Auth + Role-Based Access

```
Build authentication using Supabase.

Requirements:
- Email/password signup
- Role selector during signup (Supplier or Shop)
- Create corresponding profile record after signup
- Middleware enforcing role-based route access

Pages:
- /signup
- /login
- /supplier/dashboard
- /shop/dashboard

Constraints:
- Role stored in profile table, not client state
- Middleware must verify role server-side
- Strict TypeScript
- No UI polish

Done When:
- Supplier cannot access /shop/*
- Shop cannot access /supplier/*
- Direct URL manipulation blocked
```

Commit.

---

## 🚀 MISSION 2 — Supplier Product CRUD

```
Build Supplier Product Management.

Requirements:
- Supplier dashboard product list
- Add product form
- Edit product
- Delete product
- Image upload via Supabase storage
- Inventory count field

Constraints:
- Supplier sees only their products
- All mutations server-side
- No optimistic updates

Done When:
- Product appears on public marketplace page
- Another supplier cannot edit product via URL hack
```

Commit.

---

## 🚀 MISSION 3 — Marketplace Browse

```
Build public marketplace page.

Requirements:
- /marketplace
- List all active products
- Filter by flower type
- Product detail page

Constraints:
- Server-side data fetching
- No cart yet
- Basic availability filter

Done When:
- Shop user can view detail page
- Supplier user cannot modify product from this view
```

Commit.

---

## 🚀 MISSION 4 — Order Creation (FIRST TRUE VALUE)

```
Build Order Creation Flow.

Requirements:
- Add to cart (session-based state)
- Create Order record
- Create OrderItems
- Order status = 'pending'

Constraints:
- Orders created server-side only
- Shop can only order
- Supplier dashboard shows incoming orders
- Shop dashboard shows order history

Done When:
- Order visible to correct Supplier only
- Order visible to correct Shop only
- No cross-account data leak
```

This is MVP complete.

Stop expanding.

---

# PHASE 2 — HARDEN

## 🚀 MISSION 5 — RLS Enforcement

```
Implement Supabase Row Level Security.

Requirements:
- Suppliers can select/update only their products
- Shops can select only their own orders
- Suppliers can select only orders tied to them
- Admin bypass allowed

Include:
- SQL policy definitions
- Test scenarios

Done When:
- Manual SQL attempts to read other data fail
```

---

## 🚀 MISSION 6 — Stripe Integration

Only after real test orders.

```
Add Stripe Checkout.

Requirements:
- Platform fee 10%
- Webhook updates order status to 'paid'
- No order marked fulfilled until paid

Constraints:
- Use Stripe test mode
- Validate webhook signatures
- Idempotent order updates

Done When:
- Successful payment updates order
- Failed payment does not create paid order
```

---

# CONFIG FILE — CLAUDE.md (MINIMAL)

Place this in root.

```
# Architecture Anchors

Stack:
- Next.js 14 App Router
- Supabase (Auth + Postgres + Storage)
- TypeScript strict
- Tailwind

Rules:
- All business logic server-side
- Never trust client role state
- Use Supabase RLS before public launch
- One feature per branch
- No schema changes without migration file
- No payments until vertical slice validated

Forbidden:
- Client-side order creation
- Direct DB access from client without policy
- Adding features outside defined scope

Core Loop:
Supplier creates product → Shop orders → Supplier sees demand.
Nothing else matters.
```

Keep it under 100 lines.

---

# CONTEXT HANDOFF STRATEGY

After each mission:

1. Use `/adw-finish` to Typecheck, commit, and update the global tracker (`/PLAN.md`).
2. Export DB schema if necessary
3. Update `/docs/ARCHITECTURE.md` if necessary
4. For the next mission, run `/adw-start [mission_number]` so the Agent references the updated artifacts.

Never rely on chat memory.
Artifacts are source of truth.

---

# RISK MAP (Expert Level)

1️⃣ RLS misconfiguration → catastrophic data leak
Mitigation: Write policy tests before launch.

2️⃣ Marketplace cold start
Mitigation: Manually onboard 10 suppliers first.

3️⃣ Inventory mismatch
Mitigation: Manual confirmation workflow initially.

4️⃣ Scope creep
Mitigation: If it doesn’t improve supplier → order → reorder, cut it.

---

If you want next:

I can generate:

* A production-grade ERD with exact field types
* Supabase RLS SQL policies
* Stripe Connect alternative if you want multi-vendor payouts
* Or a growth-oriented V2 roadmap

Tell me which direction you want to optimize:
Revenue speed, architecture purity, or growth defensibility?
