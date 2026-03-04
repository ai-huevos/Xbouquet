# Xpress Buke - Agentic Development Plan

This document tracks the progress of our Agentic Development Workflow (ADW) missions.

## Mission Lifecycle Commands
- **/adw-start [mission_number]**: Initiates a mission (pulls `dev` branch, initializes context, sets up task).
- **/adw-finish**: Finalizes a mission (runs typechecks, commits, pushes to `dev`, updates this tracker, and preps for deployment).

---

## 🌊 WAVE 1: Core MVP (Production Blocking)

- [x] **Mission 1: Auth & Roles**
  - Next.js setup, Supabase link, Profiles schema & triggers, RLS, Auth Actions, basic routing.
- [ ] **Mission 2: Supplier Product CRUD**
  - Supplier dashboard, Product tables, Supabase Storage for images, Server Actions.
- [ ] **Mission 3: Marketplace Browse**
  - Public product list, detail pages, server-side data fetching for shops.
- [ ] **Mission 4: Order Creation Flow**
  - Cart state, checkout action, pending orders, basic supplier dashboard order view.
- [ ] **Mission 5: RLS Enforcement**
  - Define and apply strict Row Level Security for Profiles, Products, and Orders based on role.

## 🌊 WAVE 2: Payments & Hardening

- [ ] **Mission 6: Stripe Integration**
  - Checkout sessions, webhooks, updating order status to 'paid', idempotent handlers.
- [ ] **Mission 7: UI Polish & Optimization**
  - Human-led via Cursor + Agent. Glassmorphism, tailored palettes, loading states.

## 🌊 WAVE 3: Growth Overlay — Phase 1 (Status Layer)

- [ ] **Mission 8: Tiers & Badges Schema**
  - Create Tier tables, RLS, and Badge definitions.
- [ ] **Mission 9: Tier Engine**
  - Implement daily Tier Calculation cron job/function.
- [ ] **Mission 10: Status Dashboards**
  - Build Tier & Badge UI dashboards for Suppliers and Shops.

## 🌊 WAVE 4: Growth Overlay — Phase 2 (Viral Layer)

- [ ] **Mission 11: Network Graph**
  - Implement specific follows (Shop -> Supplier).
- [ ] **Mission 12: Invite Engine**
  - Build Referral logic (Codes, 3-stage completion, anti-gaming checks).
- [ ] **Mission 13: Showcases**
  - Arrangement photos, product tagging, likes.

## 🌊 WAVE 5: Growth Overlay — Phase 3 (Scarcity Engine)

- [ ] **Mission 14: Drops Schema**
  - Drops, Drop Items, and Drop Claims DB + RLS.
- [ ] **Mission 15: Drop Lifecycle**
  - Drop Lifecycle Functions (Cron jobs for scheduled->live, expiry).
- [ ] **Mission 16: Drop Administration**
  - Supplier Drop Management UI & Shop Drops Browse UI.
- [ ] **Mission 17: Drop Cart Engine**
  - Cart injection (Reserving drop items, TTL countdowns).

## 🌊 WAVE 6: Growth Overlay — Phase 4 (Trending)

- [ ] **Mission 18: Trending Schema**
  - Trending Snapshot + Entries tables & RLS.
- [ ] **Mission 19: Trending Engine**
  - Weekly cron job for trending calculation (products, suppliers, showcases).
- [ ] **Mission 20: Trending Interface**
  - Trending UI page.
