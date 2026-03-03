# Xpress Buke — Implementation Plan

> Generated: 2026-03-02
> Architecture source: `/docs/ARCHITECTURE.md`
> Decision log: `/docs/DECISIONS.md`

---

## Prerequisites

Before any growth system code, the **core MVP** must be functional:

- [x] Architecture frozen (`ARCHITECTURE.md`, `DECISIONS.md`, `CLAUDE.md`)
- [ ] Supabase project initialized (`supabase init`)
- [ ] Core MVP migrations applied (profiles, supplier/shop profiles, products, cart, orders)
- [ ] Auth flow working (signup with role selection, magic link)
- [ ] Core RLS policies in place
- [ ] Basic supplier CRUD (list products)
- [ ] Basic shop flow (browse, cart, checkout)
- [ ] Order lifecycle (placed → confirmed → delivered/cancelled)

> **Rule:** No growth system implementation until the core order loop works end-to-end.

---

## Phase 1: Status Layer

**Goal:** Tier scoring + badges. No dependencies on other growth systems.
**Estimated migrations:** 7 files (020–026)

### Step 1.1 — Tier Tables + RLS
```
020_create_supplier_tiers.sql
021_create_shop_tiers.sql
026_create_rls_growth_status.sql (tier policies)
```

**What to build:**
- `supplier_tiers` table with all columns per ARCHITECTURE.md §5.2
- `shop_tiers` table with all columns
- RLS: public SELECT for supplier tiers, own-only SELECT for shop tiers, system-only INSERT/UPDATE
- Index: `supplier_tiers(supplier_id)`, `shop_tiers(shop_id)` — both UNIQUE already

**Validation:**
- [ ] Tables created with correct constraints
- [ ] RLS prevents direct user writes
- [ ] Supplier tier readable by any authed user
- [ ] Shop tier readable only by the owning shop

### Step 1.2 — Badge System
```
022_create_badge_definitions.sql
023_create_user_badges.sql
024_seed_badge_definitions.sql
```

**What to build:**
- `badge_definitions` table (admin-managed, seeded)
- `user_badges` table (system-awarded, UNIQUE on user+badge)
- `user_badges_history` table (revocation log)
- Seed initial badges:

| Slug | Name | Category | Role | Criteria |
|------|------|----------|------|----------|
| `first-sale` | First Sale | milestone | supplier | `{"metric":"total_orders_fulfilled","operator":">=","value":1}` |
| `ten-sales` | 10 Sales | milestone | supplier | `{"metric":"total_orders_fulfilled","operator":">=","value":10}` |
| `century-seller` | Century Seller | milestone | supplier | `{"metric":"total_orders_fulfilled","operator":">=","value":100}` |
| `first-order` | First Order | milestone | shop | `{"metric":"total_orders_placed","operator":">=","value":1}` |
| `loyal-buyer` | Loyal Buyer | milestone | shop | `{"metric":"total_orders_placed","operator":">=","value":50}` |
| `first-referral` | First Referral | behavior | both | `{"metric":"referral_count","operator":">=","value":1}` |
| `five-referrals` | Referral Champion | behavior | both | `{"metric":"referral_count","operator":">=","value":5}` |
| `catalog-builder` | Catalog Builder | behavior | supplier | `{"metric":"unique_products","operator":">=","value":20}` |
| `supplier-explorer` | Supplier Explorer | behavior | shop | `{"metric":"unique_suppliers","operator":">=","value":10}` |
| `high-reliability` | Reliable Supplier | behavior | supplier | `{"metric":"fulfillment_rate","operator":">=","value":0.95}` |

**Validation:**
- [ ] Badge definitions seeded
- [ ] RLS: public read on definitions, system-only on user_badges

### Step 1.3 — Tier Calculation Function
```
025_create_tier_calculation_function.sql
```

**What to build:**
- `recalculate_supplier_tiers()` — PL/pgSQL function that:
  1. Queries `orders` aggregate per supplier (fulfilled count, revenue, fulfillment rate)
  2. Queries `flower_products` count per supplier
  3. Computes months active from `supplier_profiles.created_at`
  4. Applies formula from ARCHITECTURE.md §7 (supplier)
  5. Upserts into `supplier_tiers`
  6. Enforces max-1-tier-drop-per-cycle rule
- `recalculate_shop_tiers()` — same pattern using shop formula
- `check_and_award_badges()` — evaluates badge criteria against tier data
  1. Finds users whose tiers changed since last check
  2. For each, evaluates applicable badge criteria
  3. Awards new badges (INSERT into `user_badges`)
  4. Revokes badges no longer met (DELETE from `user_badges`, INSERT into `user_badges_history`)

**Key implementation detail:** Use incremental aggregation. The tier tables store running totals (`total_orders_fulfilled`, `total_revenue`, etc.). The recalculation function computes the delta since `last_calculated_at`, not a full rescan.

**Validation:**
- [ ] Function executes without error on empty data
- [ ] Function correctly computes score from test order data
- [ ] Tier only drops by 1 max per cycle
- [ ] Badges awarded and revoked correctly

### Step 1.4 — Server Actions + UI
```
src/lib/actions/tiers.ts
src/lib/actions/badges.ts
src/app/(dashboard)/supplier/tier/page.tsx
src/app/(dashboard)/shop/tier/page.tsx
```

**What to build:**
- `getMyTier()` — returns tier info for current user (supplier or shop)
- `getSupplierTier(supplierId)` — public supplier tier for catalog display
- `getMyBadges()` — returns current user's active badges
- `getUserBadges(userId)` — public badge display
- Tier page: score breakdown, current tier name, progress to next tier, badge grid

---

## Phase 2: Viral Layer

**Goal:** Follows, referrals, showcases. Depends on Phase 1 (referrals feed tier scoring).
**Estimated migrations:** 8 files (030–037)

### Step 2.1 — Follows
```
030_create_follows.sql
036_create_rls_growth_viral.sql (follows policies)
```

**What to build:**
- `follows` table (shop → supplier, UNIQUE pair)
- RLS: own shop can INSERT/DELETE, target supplier can SELECT followers
- Index: `follows(supplier_id)` for follower count queries

**Server Actions:**
- `followSupplier(supplierId)` — insert follow, idempotent
- `unfollowSupplier(supplierId)` — delete follow
- `getFollowing()` — list followed suppliers for current shop
- `getFollowerCount(supplierId)` — public count

**Validation:**
- [ ] Follow/unfollow toggle works
- [ ] Can't follow same supplier twice (UNIQUE constraint)
- [ ] Follower count accurate

### Step 2.2 — Referral System
```
031_create_referral_codes.sql
032_create_referral_completions.sql
037_create_referral_functions.sql
```

**What to build:**
- `referral_codes` table with format `XB-{ADJ}-{NOUN}-{4DIGITS}`
- `referral_completions` table with 3-stage lifecycle
- `generate_referral_code()` — PL/pgSQL function:
  1. Pick random adjective + noun from word pools
  2. Generate 4 random digits
  3. Check collision, retry if exists
  4. Return code string
- `apply_referral_code(code, user_id)` — validates and creates completion row
- `advance_referral_status(user_id, new_status)` — called by profile completion and order delivery hooks

**Anti-gaming checks (enforce in functions):**
- `referrer_id != referred_id`
- `referred_id` is UNIQUE (can't be referred twice)
- Code must be active and not expired
- `current_uses < max_uses` (if max set)
- Qualification requires delivered order status

**Server Actions:**
- `generateReferralCode()` — creates new code for current user
- `getMyCodes()` — list codes with usage stats
- `getMyReferrals()` — completion statuses
- `applyReferralCode(code)` — used during signup flow

**Validation:**
- [ ] Code generation produces valid format
- [ ] Collision retry works
- [ ] Status transitions enforce order (signed_up → activated → qualified)
- [ ] Anti-gaming rules block exploits

### Step 2.3 — Showcases
```
033_create_showcases.sql
034_create_showcase_products.sql
035_create_showcase_likes.sql
036_create_rls_growth_viral.sql (showcase policies)
```

**What to build:**
- `showcases` table (shop-owned arrangement photos)
- `showcase_products` junction table (ON DELETE SET NULL for products)
- `showcase_likes` (one per user per showcase)
- RLS: published showcases readable by all, CRUD restricted to owning shop
- Storage bucket config: `showcases` bucket, max 5MB/image, max 10 showcases per shop

**Server Actions:**
- `createShowcase(title, description, imageFile)` — upload image + create row
- `updateShowcase(id, updates)` — edit own showcase
- `deleteShowcase(id)` — delete own showcase + storage cleanup
- `tagProduct(showcaseId, productId)` — link product
- `untagProduct(showcaseId, productId)` — unlink
- `likeShowcase(showcaseId)` — toggle like
- `getShowcases(filters?)` — browse published, with like counts

**Validation:**
- [ ] Image upload works with size limit
- [ ] 10-showcase-per-shop limit enforced
- [ ] Product deactivation doesn't break showcases (SET NULL)
- [ ] Like toggle is idempotent

---

## Phase 3: Scarcity Engine

**Goal:** Time-limited drops with reservation system. Depends on Phase 1 (tier-restricted access).
**Estimated migrations:** 6 files (040–045)

### Step 3.1 — Drop Tables + RLS
```
040_create_drops.sql
041_create_drop_items.sql
042_create_drop_claims.sql
045_create_rls_growth_scarcity.sql
```

**What to build:**
- `drops` table with full lifecycle status
- `drop_items` table (products allocated to a drop)
- `drop_claims` table (shop reservations with TTL)
- RLS per ARCHITECTURE.md §10:
  - Live drops publicly readable
  - Draft/scheduled visible only to owning supplier
  - Claims visible to owning shop + supplier
  - Status transitions: system-only (via functions)
- Indexes:
  - `drops(status, starts_at)` — for cron scheduled→live scan
  - `drops(status, ends_at)` — for cron live→ended scan
  - `drop_claims(status, expires_at) WHERE status = 'reserved'` — partial index for expiry scan

### Step 3.2 — Drop Lifecycle Functions
```
043_create_drop_lifecycle_functions.sql
044_create_drop_claim_expiry_function.sql
```

**What to build:**

`publish_drop(drop_id)`:
1. Validate: has items, valid dates, `starts_at` in future
2. For each `drop_item`: decrement `flower_products.stock_qty` by `drop_qty`
3. Set status → 'scheduled'
4. Return success/error

`cancel_drop(drop_id)`:
1. Cancel all active claims (set status='cancelled')
2. For each `drop_item`: restore `flower_products.stock_qty`
3. Set status → 'cancelled'

`claim_drop_item(drop_item_id, shop_id, quantity)`:
1. Check drop is 'live'
2. Check tier restriction (if visibility = 'tier_restricted', shop tier >= min_shop_tier)
3. `SELECT FOR UPDATE` on drop_item row
4. Check `claimed_qty + quantity <= drop_qty`
5. Check `max_per_shop` limit (sum of shop's existing claims for this item)
6. Increment `claimed_qty`
7. Create `drop_claims` row (status='reserved', expires_at = now() + 30min)
8. Return claim details

`advance_drop_statuses()` (cron):
1. `UPDATE drops SET status = 'live' WHERE status = 'scheduled' AND starts_at <= now()`
2. `UPDATE drops SET status = 'ended' WHERE status IN ('live','sold_out') AND ends_at <= now()`

`expire_drop_claims()` (cron):
1. Find claims WHERE status='reserved' AND expires_at < now()
2. For each: decrement `drop_items.claimed_qty` by claim quantity
3. Set claim status='expired'

**Validation:**
- [ ] Race condition test: two concurrent claims for last item → only one succeeds
- [ ] Stock correctly decremented on publish, restored on cancel
- [ ] Claim expiry correctly restores claimed_qty
- [ ] Tier restriction enforced for tier_restricted drops
- [ ] State machine transitions follow valid paths only

### Step 3.3 — Server Actions + UI
```
src/lib/actions/drops.ts
src/lib/validators/drop.ts
src/app/(dashboard)/supplier/drops/page.tsx
src/app/(dashboard)/supplier/drops/new/page.tsx
src/app/(dashboard)/supplier/drops/[id]/page.tsx
src/app/(dashboard)/shop/drops/page.tsx
src/app/(dashboard)/shop/drops/[id]/page.tsx
```

**Supplier drop management:**
- `createDrop(data)` — create draft
- `updateDrop(id, data)` — edit draft/scheduled
- `publishDrop(id)` — calls `publish_drop()` DB function
- `cancelDrop(id)` — calls `cancel_drop()` DB function
- `addDropItem(dropId, productId, price, qty, maxPerShop?)` — add product to draft drop
- `removeDropItem(dropItemId)` — remove from draft

**Shop drop interaction:**
- `getLiveDrops()` — browse live drops (filtered by tier eligibility)
- `getDrop(id)` — drop detail with items + claimed status
- `claimDropItem(dropItemId, quantity)` — calls `claim_drop_item()` DB function

**Cart integration (minimal core touch):**
- Drop claims with status='reserved' appear in cart view
- Cart query joins `drop_claims` to show reserved items with countdown
- Checkout flow: after order creation, update `drop_claims.order_id` and set status='converted'
- This is the ONE point where growth touches core — documented in ADR-001

**Validation:**
- [ ] Full lifecycle: draft → scheduled → live → sold_out → ended
- [ ] Supplier can only manage own drops
- [ ] Shop sees only eligible drops
- [ ] Cart shows drop items with expiry countdown
- [ ] Checkout converts claims correctly

---

## Phase 4: Trending Snapshot

**Goal:** Weekly materialized rankings. Depends on all above for scoring inputs.
**Estimated migrations:** 4 files (050–053)

### Step 4.1 — Trending Tables
```
050_create_trending_snapshots.sql
051_create_trending_entries.sql
053_create_rls_growth_trending.sql
```

**What to build:**
- `trending_snapshots` table (one row per week per type)
- `trending_entries` table (ranked list per snapshot)
- RLS: SELECT for all authed users, INSERT/UPDATE system-only
- UNIQUE(week_start, snapshot_type) prevents duplicate snapshots

### Step 4.2 — Trending Calculation Function
```
052_create_trending_calculation_function.sql
```

**What to build:**

`calculate_trending_products(week_start, week_end)`:
1. Aggregate order_items by product for the week
2. Score = weighted(order_count, total_quantity, unique_buyers)
3. Create snapshot + entries with ranks
4. Compute rank_delta from previous week's snapshot

`calculate_trending_suppliers(week_start, week_end)`:
1. Aggregate orders by supplier
2. Score = weighted(order_count, revenue, new_followers, fulfillment_rate)
3. Create snapshot + entries

`calculate_trending_showcases(week_start, week_end)`:
1. Aggregate showcase_likes for the week
2. Score = weighted(new_likes, total_likes, product_tag_count)
3. Create snapshot + entries

`calculate_all_trending()` (weekly cron wrapper):
1. Determine current week boundaries
2. Call all three calculate functions
3. Log completion

**Validation:**
- [ ] Trending calculated correctly from test data
- [ ] Rank delta computed against previous week
- [ ] Duplicate snapshot prevention (UNIQUE constraint)

### Step 4.3 — Server Actions + UI
```
src/lib/actions/trending.ts
src/app/(dashboard)/trending/page.tsx
```

- `getTrending(type?, week?)` — returns current or historical trending
- Trending page: tabs for Products / Suppliers / Showcases, rank cards with delta arrows

---

## Cron Job Setup

After all phases deployed, configure scheduled jobs:

| Job | Schedule | Function |
|-----|----------|----------|
| Tier recalculation | `0 2 * * *` (daily 02:00 UTC) | `recalculate_supplier_tiers()` + `recalculate_shop_tiers()` |
| Badge check | `30 2 * * *` (daily 02:30 UTC) | `check_and_award_badges()` |
| Drop status advance | `*/5 * * * *` (every 5 min) | `advance_drop_statuses()` |
| Drop claim expiry | `*/5 * * * *` (every 5 min) | `expire_drop_claims()` |
| Trending calculation | `0 3 * * 0` (Sunday 03:00 UTC) | `calculate_all_trending()` |

**Implementation:** Supabase Edge Function with cron trigger, or `pg_cron` extension if available.

---

## Implementation Order Summary

```
Core MVP (must be complete first)
  │
  ▼
Phase 1: Status Layer ──────────────────────── ~7 migrations, 2 actions files, 2 pages
  │  supplier_tiers, shop_tiers, badges
  │  tier calculation function
  │
  ▼
Phase 2: Viral Layer ───────────────────────── ~8 migrations, 3 actions files, 4 pages
  │  follows, referral_codes, referral_completions
  │  showcases, showcase_products, showcase_likes
  │
  ▼
Phase 3: Scarcity Engine ───────────────────── ~6 migrations, 1 actions file, 5 pages
  │  drops, drop_items, drop_claims
  │  lifecycle + claim functions
  │  cart integration (minimal core touch)
  │
  ▼
Phase 4: Trending Snapshot ─────────────────── ~4 migrations, 1 actions file, 1 page
  │  trending_snapshots, trending_entries
  │  calculation functions
  │
  ▼
Cron Jobs (configure after all phases) ─────── 5 scheduled functions
```

**Total new artifacts:**
- 25 migration files
- 7 Server Action files
- 3 Validator files
- 12 page components
- 5 cron jobs

---

## Risk Checklist

Before each phase ships:

- [ ] All migrations apply cleanly on fresh Supabase project
- [ ] RLS policies tested (authed as each role)
- [ ] No modifications to core MVP table schemas
- [ ] Server Actions validate input with Zod
- [ ] Error paths return meaningful messages (no raw Postgres errors to client)
- [ ] Race condition scenarios tested (drops: concurrent claims)
- [ ] `ARCHITECTURE.md` still accurate (update if deviations occurred)
- [ ] Any deviations logged in `DECISIONS.md` as new ADRs
