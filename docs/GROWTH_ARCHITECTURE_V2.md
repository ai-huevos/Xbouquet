# Xpress Buke — Architecture Source of Truth

> Last updated: 2026-03-02
> Status: Frozen — changes require a DECISIONS.md entry

---

## 1. System Overview

B2B flower marketplace connecting **suppliers** (growers/wholesalers) with **shops** (florists/retailers).

**Core loop:** Supplier lists inventory → Shop browses → Shop orders → Supplier fulfills → Shop reorders

**Growth overlay (4 modular systems):**
1. Scarcity Engine — time-limited product drops
2. Status Layer — supplier/shop tiers + achievement badges
3. Viral Layer — follows, referrals, arrangement showcases
4. Trending Snapshot — weekly materialized rankings

**Constraint:** Growth systems are read-derived overlays. They never modify the core order flow.

---

## 2. Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Auth | Supabase Auth (email + magic link) |
| Database | Supabase (PostgreSQL 15+) |
| Storage | Supabase Storage (product images, showcases) |
| RLS | Row Level Security on every table |
| Hosting | Vercel |
| Styling | Tailwind CSS v4 |
| Validation | Zod |
| State | Server Actions + React Server Components |

---

## 3. Role Model

| Role | Profile Table | Can Do |
|------|--------------|--------|
| `supplier` | `supplier_profiles` | List products, create drops, fulfill orders, view own tier |
| `shop` | `shop_profiles` | Browse, order, claim drops, showcase, follow, refer, view own tier |
| `admin` | (role flag on profiles) | Manage all — future phase |

Role is set at signup and immutable. Stored in `profiles.role`.

---

## 4. ERD — Core MVP Tables

```
profiles (id, user_id, role, full_name, avatar_url, created_at, updated_at)
  ├── supplier_profiles (id, profile_id, business_name, ...)
  │     └── flower_products (id, supplier_id, name, price_per_unit, stock_qty, ...)
  └── shop_profiles (id, profile_id, business_name, ...)
        └── cart_items (id, shop_id, product_id, quantity, ...)

order_groups (id, shop_id, created_at)
  └── orders (id, order_group_id, supplier_id, shop_id, status, ...)
        └── order_items (id, order_id, product_id, quantity, unit_price, ...)

product_categories (id, name, slug)
```

---

## 5. ERD — Growth Extension Tables

### 5.1 Scarcity Engine

#### `drops`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() |
| supplier_id | uuid | NOT NULL, FK → supplier_profiles(id) ON DELETE CASCADE |
| title | text | NOT NULL |
| description | text | |
| image_url | text | |
| starts_at | timestamptz | NOT NULL |
| ends_at | timestamptz | NOT NULL, CHECK (ends_at > starts_at) |
| status | text | NOT NULL, DEFAULT 'draft', CHECK IN ('draft','scheduled','live','sold_out','ended','cancelled') |
| max_orders | integer | Nullable (null = unlimited) |
| current_orders | integer | NOT NULL, DEFAULT 0 |
| visibility | text | NOT NULL, DEFAULT 'public', CHECK IN ('public','tier_restricted') |
| min_shop_tier | integer | DEFAULT 0 |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

#### `drop_items`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| drop_id | uuid | NOT NULL, FK → drops(id) ON DELETE CASCADE |
| product_id | uuid | NOT NULL, FK → flower_products(id) ON DELETE RESTRICT |
| drop_price | numeric(10,2) | NOT NULL |
| drop_qty | integer | NOT NULL, CHECK (>= 1) |
| claimed_qty | integer | NOT NULL, DEFAULT 0 |
| max_per_shop | integer | Nullable |
| created_at | timestamptz | DEFAULT now() |
| | | UNIQUE(drop_id, product_id) |

#### `drop_claims`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| drop_id | uuid | NOT NULL, FK → drops(id) |
| drop_item_id | uuid | NOT NULL, FK → drop_items(id) |
| shop_id | uuid | NOT NULL, FK → shop_profiles(id) |
| order_id | uuid | Nullable, FK → orders(id) |
| quantity | integer | NOT NULL, CHECK (>= 1) |
| status | text | NOT NULL, DEFAULT 'reserved', CHECK IN ('reserved','converted','expired','cancelled') |
| reserved_at | timestamptz | DEFAULT now() |
| expires_at | timestamptz | NOT NULL |

### 5.2 Status Layer

#### `supplier_tiers`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| supplier_id | uuid | UNIQUE, NOT NULL, FK → supplier_profiles(id) ON DELETE CASCADE |
| tier | integer | NOT NULL, DEFAULT 0, CHECK (BETWEEN 0 AND 4) |
| score | numeric(10,2) | NOT NULL, DEFAULT 0 |
| total_orders_fulfilled | integer | NOT NULL, DEFAULT 0 |
| total_revenue | numeric(12,2) | NOT NULL, DEFAULT 0 |
| fulfillment_rate | numeric(5,4) | NOT NULL, DEFAULT 0 |
| unique_products | integer | NOT NULL, DEFAULT 0 |
| active_since | timestamptz | NOT NULL |
| last_calculated_at | timestamptz | DEFAULT now() |

#### `shop_tiers`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| shop_id | uuid | UNIQUE, NOT NULL, FK → shop_profiles(id) ON DELETE CASCADE |
| tier | integer | NOT NULL, DEFAULT 0, CHECK (BETWEEN 0 AND 4) |
| score | numeric(10,2) | NOT NULL, DEFAULT 0 |
| total_orders_placed | integer | NOT NULL, DEFAULT 0 |
| total_spent | numeric(12,2) | NOT NULL, DEFAULT 0 |
| unique_suppliers | integer | NOT NULL, DEFAULT 0 |
| referral_count | integer | NOT NULL, DEFAULT 0 |
| active_since | timestamptz | NOT NULL |
| last_calculated_at | timestamptz | DEFAULT now() |

#### `badge_definitions`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| slug | text | UNIQUE, NOT NULL |
| name | text | NOT NULL |
| description | text | NOT NULL |
| icon_url | text | |
| category | text | NOT NULL, CHECK IN ('milestone','behavior','seasonal','special') |
| role | text | NOT NULL, CHECK IN ('supplier','shop','both') |
| criteria_json | jsonb | NOT NULL |
| sort_order | integer | DEFAULT 0 |
| is_active | boolean | DEFAULT true |

> `criteria_json` example: `{ "metric": "total_orders_fulfilled", "operator": ">=", "value": 100 }`

#### `user_badges`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| user_id | uuid | NOT NULL, FK → profiles(id) ON DELETE CASCADE |
| badge_id | uuid | NOT NULL, FK → badge_definitions(id) |
| awarded_at | timestamptz | DEFAULT now() |
| | | UNIQUE(user_id, badge_id) |

#### `user_badges_history`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| user_id | uuid | NOT NULL, FK → profiles(id) ON DELETE CASCADE |
| badge_id | uuid | NOT NULL, FK → badge_definitions(id) |
| awarded_at | timestamptz | NOT NULL |
| revoked_at | timestamptz | DEFAULT now() |
| reason | text | DEFAULT 'criteria_no_longer_met' |

### 5.3 Viral Layer

#### `follows`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| follower_id | uuid | NOT NULL, FK → shop_profiles(id) ON DELETE CASCADE |
| supplier_id | uuid | NOT NULL, FK → supplier_profiles(id) ON DELETE CASCADE |
| created_at | timestamptz | DEFAULT now() |
| | | UNIQUE(follower_id, supplier_id) |

#### `referral_codes`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| referrer_id | uuid | NOT NULL, FK → profiles(id) ON DELETE CASCADE |
| code | text | UNIQUE, NOT NULL |
| max_uses | integer | Nullable |
| current_uses | integer | NOT NULL, DEFAULT 0 |
| is_active | boolean | DEFAULT true |
| created_at | timestamptz | DEFAULT now() |
| expires_at | timestamptz | Nullable |

> Code format: `XB-{ADJECTIVE}-{NOUN}-{4DIGITS}` (e.g., `XB-BRIGHT-TULIP-4829`)

#### `referral_completions`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| code_id | uuid | NOT NULL, FK → referral_codes(id) |
| referrer_id | uuid | NOT NULL, FK → profiles(id) |
| referred_id | uuid | NOT NULL, FK → profiles(id) ON DELETE CASCADE |
| referred_role | text | NOT NULL |
| status | text | NOT NULL, DEFAULT 'signed_up', CHECK IN ('signed_up','activated','qualified') |
| signed_up_at | timestamptz | DEFAULT now() |
| activated_at | timestamptz | Nullable |
| qualified_at | timestamptz | Nullable |
| | | UNIQUE(referred_id) |

#### `showcases`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| shop_id | uuid | NOT NULL, FK → shop_profiles(id) ON DELETE CASCADE |
| title | text | NOT NULL |
| description | text | |
| image_url | text | NOT NULL |
| is_published | boolean | DEFAULT true |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

#### `showcase_products`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| showcase_id | uuid | NOT NULL, FK → showcases(id) ON DELETE CASCADE |
| product_id | uuid | NOT NULL, FK → flower_products(id) ON DELETE SET NULL |
| | | UNIQUE(showcase_id, product_id) |

#### `showcase_likes`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| showcase_id | uuid | NOT NULL, FK → showcases(id) ON DELETE CASCADE |
| user_id | uuid | NOT NULL, FK → profiles(id) ON DELETE CASCADE |
| created_at | timestamptz | DEFAULT now() |
| | | UNIQUE(showcase_id, user_id) |

### 5.4 Trending Snapshot

#### `trending_snapshots`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| week_start | date | NOT NULL |
| week_end | date | NOT NULL |
| snapshot_type | text | NOT NULL, CHECK IN ('product','supplier','showcase') |
| created_at | timestamptz | DEFAULT now() |
| | | UNIQUE(week_start, snapshot_type) |

#### `trending_entries`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| snapshot_id | uuid | NOT NULL, FK → trending_snapshots(id) ON DELETE CASCADE |
| rank | integer | NOT NULL |
| entity_type | text | NOT NULL |
| entity_id | uuid | NOT NULL |
| score | numeric(10,2) | NOT NULL |
| metrics_json | jsonb | NOT NULL |
| previous_rank | integer | Nullable |
| rank_delta | integer | Nullable |

---

## 6. Relationship Map

```
                         ┌──────────────┐
                         │   profiles    │
                         │  (id, role)   │
                         └──────┬───────┘
                    ┌───────────┼───────────┐
                    ▼           │           ▼
          ┌─────────────┐      │   ┌────────────┐
          │  supplier_   │      │   │   shop_     │
          │  profiles    │      │   │  profiles   │
          └──────┬──────┘      │   └──────┬──────┘
                 │             │          │
    ┌────────────┼─────┐      │    ┌─────┼──────────┐
    │            │     │      │    │     │          │
    ▼            ▼     ▼      │    ▼     ▼          ▼
┌────────┐ ┌────────┐ ┌──────┤  ┌──────┐ ┌────────┐ ┌──────────┐
│flower_ │ │ drops  │ │suppl.│  │cart_ │ │follows │ │showcases │
│products│ │        │ │tiers │  │items │ │        │ │          │
└───┬────┘ └───┬────┘ └──────┘  └──┬───┘ └────────┘ └────┬─────┘
    │          │                   │                      │
    │     ┌────┴────┐              │                 ┌────┴──────┐
    │     ▼         ▼              │                 ▼           ▼
    │ ┌────────┐ ┌───────┐        │           ┌──────────┐ ┌─────────┐
    │ │drop_   │ │drop_  │        │           │showcase_ │ │showcase_│
    │ │items   │ │claims │        │           │products  │ │likes    │
    │ └────────┘ └───┬───┘        │           └──────────┘ └─────────┘
    │                │            │
    │                ▼            ▼
    │          ┌──────────┐  ┌────────┐
    │          │  orders   │◄─│order_  │
    │          │(+group_id)│  │groups  │
    │          └─────┬─────┘  └────────┘
    │                │
    │                ▼
    │          ┌──────────┐
    └─────────►│order_    │
               │items     │
               └──────────┘

STANDALONE:
┌──────────────┐  ┌────────────────┐  ┌───────────────────┐
│ shop_tiers   │  │ referral_codes │  │ trending_snapshots │
└──────────────┘  └───────┬────────┘  └────────┬──────────┘
                          ▼                    ▼
                  ┌───────────────┐    ┌────────────────┐
                  │  referral_    │    │ trending_      │
                  │  completions  │    │ entries        │
                  └───────────────┘    └────────────────┘

┌───────────────────┐  ┌──────────────┐
│ badge_definitions │  │ user_badges  │
└───────────────────┘  └──────────────┘
```

### Key relationship rules:
- **Drops → Products:** Drop items reference existing `flower_products`. Claims reserve inventory, then convert to regular orders.
- **Follows:** Shop → Supplier. One-directional. No reciprocity.
- **Showcases → Products:** Many-to-many via `showcase_products`. `ON DELETE SET NULL` allows product deactivation.
- **Tiers:** Derived tables — computed from orders, products, referrals. Never user-written.
- **Trending:** Snapshot tables populated by batch job. Read-only for users.
- **Core flow untouched:** `orders`, `order_items`, `order_groups`, `cart_items` schemas are identical to MVP.

---

## 7. Tier Scoring Formulas

### Supplier Tier

**Inputs** (derived from `orders` + `flower_products`):
- `F` = total orders fulfilled (status = 'delivered')
- `R` = fulfillment rate (delivered / (delivered + cancelled by supplier))
- `V` = total revenue from fulfilled orders
- `P` = count of unique active products
- `A` = months active on platform

**Formula:**
```
supplier_score = (
    0.35 × normalize(F, 500)    +   // Volume
    0.25 × R                     +   // Reliability (already 0-1)
    0.20 × normalize(V, 50000)  +   // Revenue
    0.10 × normalize(P, 50)     +   // Catalog diversity
    0.10 × normalize(A, 24)         // Tenure
) × 100
```

`normalize(value, max)` = `min(value / max, 1.0)`

**Thresholds:**
| Tier | Name | Score | Unlocks |
|------|------|-------|---------|
| 0 | New | 0–19 | Basic listing |
| 1 | Verified | 20–39 | Featured in directory |
| 2 | Trusted | 40–59 | Create drops, priority search |
| 3 | Premium | 60–79 | Tier-restricted drops, trending eligibility |
| 4 | Elite | 80–100 | Homepage feature, verified badge, analytics |

### Shop Tier

**Inputs:**
- `O` = total orders placed (status != 'cancelled')
- `S` = total spent (from delivered orders)
- `U` = unique suppliers ordered from
- `Ref` = qualified referral completions
- `A` = months active

**Formula:**
```
shop_score = (
    0.30 × normalize(O, 200)    +   // Order frequency
    0.25 × normalize(S, 25000)  +   // Spending
    0.15 × normalize(U, 20)     +   // Supplier diversity
    0.20 × normalize(Ref, 10)   +   // Referral contribution
    0.10 × normalize(A, 24)         // Tenure
) × 100
```

**Thresholds:**
| Tier | Name | Score | Unlocks |
|------|------|-------|---------|
| 0 | New | 0–19 | Basic ordering |
| 1 | Active | 20–39 | Tier-1 drops |
| 2 | Loyal | 40–59 | Tier-2 drops, showcase feature |
| 3 | VIP | 60–79 | Early access all drops, priority support |
| 4 | Ambassador | 80–100 | Exclusive drops, featured showcases |

### Recalculation Rules
- **Frequency:** Daily at 02:00 UTC
- **Method:** Incremental — track running totals, compute delta from `last_calculated_at`
- **Grace:** Tier can only drop by 1 level per cycle
- **Not real-time:** Eventual consistency by design

---

## 8. Drop Lifecycle State Machine

```
draft → scheduled → live → sold_out → ended
                  → live → ended
draft → cancelled
scheduled → cancelled
live → cancelled
sold_out → cancelled
```

### Valid transitions:
| From | To | Trigger |
|------|----|---------|
| draft | scheduled | Supplier publishes (validates items, dates, future start) |
| draft | cancelled | Supplier deletes draft |
| scheduled | live | Cron: `starts_at <= now()` |
| scheduled | cancelled | Supplier cancels before start |
| live | sold_out | Auto: all items claimed OR max_orders reached |
| live | ended | Cron: `ends_at <= now()` |
| live | cancelled | Supplier emergency cancel |
| sold_out | ended | Cron: `ends_at <= now()` |
| sold_out | cancelled | Supplier emergency cancel |

### Drop → Order bridge:
1. Shop claims items → `drop_claims` created (status='reserved', 30-min TTL)
2. `drop_items.claimed_qty` incremented atomically (`SELECT FOR UPDATE`)
3. Reserved items appear in cart (special UI, countdown timer)
4. Shop checks out → `drop_claims.order_id` set, status='converted'
5. If TTL expires → cron reverts `claimed_qty`, claim status='expired'
6. **Core order flow untouched** — drops inject into cart → checkout pipeline

### Inventory model:
- `drop_qty` is separate from `flower_products.stock_qty`
- Publishing decrements `stock_qty` by `drop_qty` (locks supply)
- Cancellation restores `drop_qty` to `stock_qty`

---

## 9. Referral System

### Lifecycle:
```
Code Created → Link Shared → Referred Signs Up (signed_up)
  → Completes Profile (activated) → First Transaction Delivered (qualified)
  → Referrer Gets Credit
```

### Anti-gaming:
- UNIQUE on `referred_id` — one referral per person
- `referrer_id != referred_id` check
- Code expires after `expires_at` (default 30 days)
- `max_uses` caps per code
- Qualification requires **delivered** order (not just placed)
- Credit only at next tier recalculation (not instant)

### Code format:
`XB-{ADJECTIVE}-{NOUN}-{4DIGITS}` (e.g., `XB-BRIGHT-TULIP-4829`)

---

## 10. RLS Policy Draft

### Core principle:
- Every table has RLS enabled
- Default deny — explicit policies only
- Auth uses `auth.uid()` → `profiles.user_id` → role-specific profile

### Growth tables RLS summary:

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| drops | Public (live), own (supplier) | Own supplier | Own supplier (draft/scheduled only) | Own supplier (draft only) |
| drop_items | Via drop access | Own supplier (via drop) | Own supplier (via drop, draft only) | Own supplier (draft only) |
| drop_claims | Own shop/supplier | Own shop (live drops) | System only (status transitions) | — |
| supplier_tiers | Public read | System only | System only | — |
| shop_tiers | Own shop, suppliers see tier of ordering shops | System only | System only | — |
| badge_definitions | Public read | Admin only | Admin only | Admin only |
| user_badges | Public read | System only | — | System only |
| follows | Own shop, target supplier | Own shop | — | Own shop |
| referral_codes | Own user | Own user | Own user | — |
| referral_completions | Own referrer | System only | System only | — |
| showcases | Public (published) | Own shop | Own shop | Own shop |
| showcase_products | Via showcase access | Own shop (via showcase) | — | Own shop |
| showcase_likes | Own user | Own user | — | Own user |
| trending_snapshots | All authed | System only | — | — |
| trending_entries | All authed | System only | — | — |

---

## 11. API Route Map (Server Actions)

### Drops
| Action | File | Auth | Description |
|--------|------|------|-------------|
| `createDrop` | `actions/drops.ts` | supplier | Create draft drop |
| `updateDrop` | `actions/drops.ts` | supplier (owner) | Edit draft/scheduled drop |
| `publishDrop` | `actions/drops.ts` | supplier (owner) | Transition draft → scheduled |
| `cancelDrop` | `actions/drops.ts` | supplier (owner) | Cancel any pre-ended drop |
| `claimDropItem` | `actions/drops.ts` | shop | Reserve items from live drop |
| `getDrops` | `actions/drops.ts` | any authed | List drops (filtered by role/status) |
| `getDrop` | `actions/drops.ts` | any authed | Single drop detail |

### Tiers & Badges
| Action | File | Auth | Description |
|--------|------|------|-------------|
| `getMyTier` | `actions/tiers.ts` | any authed | Own tier + score breakdown |
| `getSupplierTier` | `actions/tiers.ts` | any authed | Public supplier tier info |
| `getMyBadges` | `actions/badges.ts` | any authed | Own badges |
| `getUserBadges` | `actions/badges.ts` | any authed | Public badge display |

### Follows
| Action | File | Auth | Description |
|--------|------|------|-------------|
| `followSupplier` | `actions/follows.ts` | shop | Follow a supplier |
| `unfollowSupplier` | `actions/follows.ts` | shop | Unfollow |
| `getFollowing` | `actions/follows.ts` | shop | List followed suppliers |
| `getFollowerCount` | `actions/follows.ts` | supplier | Own follower count |

### Referrals
| Action | File | Auth | Description |
|--------|------|------|-------------|
| `generateReferralCode` | `actions/referrals.ts` | any authed | Create new code |
| `getMyCodes` | `actions/referrals.ts` | any authed | List own codes + stats |
| `getMyReferrals` | `actions/referrals.ts` | any authed | Referral completions |
| `applyReferralCode` | `actions/referrals.ts` | new user | Use code during signup |

### Showcases
| Action | File | Auth | Description |
|--------|------|------|-------------|
| `createShowcase` | `actions/showcases.ts` | shop | Create arrangement showcase |
| `updateShowcase` | `actions/showcases.ts` | shop (owner) | Edit own showcase |
| `deleteShowcase` | `actions/showcases.ts` | shop (owner) | Delete own showcase |
| `tagProduct` | `actions/showcases.ts` | shop (owner) | Link product to showcase |
| `likeShowcase` | `actions/showcases.ts` | any authed | Like/unlike toggle |
| `getShowcases` | `actions/showcases.ts` | any authed | Browse published showcases |

### Trending
| Action | File | Auth | Description |
|--------|------|------|-------------|
| `getTrending` | `actions/trending.ts` | any authed | Current week's trending |
| `getTrendingHistory` | `actions/trending.ts` | any authed | Past weeks |

---

## 12. Page Map

```
app/(dashboard)/
├── supplier/
│   ├── drops/
│   │   ├── page.tsx              # List own drops
│   │   ├── new/page.tsx          # Create drop wizard
│   │   └── [id]/page.tsx         # Drop detail + manage
│   └── tier/page.tsx             # Own tier + badges
├── shop/
│   ├── drops/
│   │   ├── page.tsx              # Browse live drops
│   │   └── [id]/page.tsx         # Drop detail + claim
│   ├── showcases/
│   │   ├── page.tsx              # Browse showcases
│   │   ├── new/page.tsx          # Create showcase
│   │   └── [id]/page.tsx         # Showcase detail
│   ├── referrals/page.tsx        # Manage codes + track
│   └── tier/page.tsx             # Own tier + badges
└── trending/page.tsx             # Shared: weekly trending
```

---

## 13. Migration Sequence

All growth tables are **additive** — no modifications to existing MVP tables.

### Phase 1: Status Layer
```
020_create_supplier_tiers.sql
021_create_shop_tiers.sql
022_create_badge_definitions.sql
023_create_user_badges.sql
024_seed_badge_definitions.sql
025_create_tier_calculation_function.sql
026_create_rls_growth_status.sql
```

### Phase 2: Viral Layer (depends on tiers)
```
030_create_follows.sql
031_create_referral_codes.sql
032_create_referral_completions.sql
033_create_showcases.sql
034_create_showcase_products.sql
035_create_showcase_likes.sql
036_create_rls_growth_viral.sql
037_create_referral_functions.sql
```

### Phase 3: Scarcity Engine (depends on tiers)
```
040_create_drops.sql
041_create_drop_items.sql
042_create_drop_claims.sql
043_create_drop_lifecycle_functions.sql
044_create_drop_claim_expiry_function.sql
045_create_rls_growth_scarcity.sql
```

### Phase 4: Trending Snapshot (depends on all above)
```
050_create_trending_snapshots.sql
051_create_trending_entries.sql
052_create_trending_calculation_function.sql
053_create_rls_growth_trending.sql
```

---

## 14. Cron Jobs

| Job | Frequency | Description |
|-----|-----------|-------------|
| `recalculate_tiers` | Daily 02:00 UTC | Recompute all tier scores and levels |
| `advance_drop_statuses` | Every 5 min | scheduled→live, live/sold_out→ended |
| `expire_drop_claims` | Every 5 min | Expire unchecked-out reservations, restore claimed_qty |
| `calculate_trending` | Weekly Sun 03:00 UTC | Compute weekly trending rankings |
| `check_badge_awards` | Daily 02:30 UTC | Award/revoke badges based on criteria |

---

## 15. Performance Mitigations

| Risk | Mitigation |
|------|------------|
| Tier recalc at scale | Incremental aggregation via running totals, delta from `last_calculated_at` |
| Drop claim race condition | `SELECT FOR UPDATE` on `drop_items`, atomic `claimed_qty` increment |
| Reservation expiry scan | Partial index: `drop_claims(status, expires_at) WHERE status = 'reserved'` |
| Trending query complexity | Pre-aggregate CTEs, run off-peak |
| Showcase images | Storage bucket quota per user, max 10 showcases/shop, 5MB/image |
| Badge eval cost | Two-pass: filter changed tiers first, then evaluate only those users |
| Drop items in cart | Cart returns `source` ('catalog'/'drop') + `expires_at`, UI shows countdown |
| RLS on growth tables | Simple role/owner gating; `trending_entries` publicly readable |
| Drop stock double-booking | `stock_qty` decremented on publish, restored on cancel |
| Referral gaming | Qualification requires delivered order, credit at next recalc only |
