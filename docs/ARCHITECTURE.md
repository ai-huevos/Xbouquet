# Xpress Buke — Architecture (MVP Core)

> Last updated: 2026-03-02
> Status: Active — this is the only architecture that matters until core ships

---

## 1. What This Is

B2B flower marketplace. Suppliers list flowers, shops order them.

**Core loop — the only thing to build:**

```
Supplier signs up → Lists products → Shop signs up → Browses → Adds to cart → Checks out → Supplier sees order → Marks fulfilled → Shop sees fulfilled
```

Nothing else exists until this works in production with real users.

---

## 2. Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router, RSC, Server Actions) |
| Language | TypeScript (strict) |
| Auth | Supabase Auth (email + magic link) |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage (product images) |
| Security | Row Level Security on every table |
| Hosting | Vercel |
| Styling | Tailwind CSS v4 |
| Validation | Zod |
| Data Ingestion | Papaparse (CSV parsing & column mapping) |

---

## 3. Roles

| Role | Set at | Mutable | Profile Table |
|------|--------|---------|---------------|
| `supplier` | Signup | No | `supplier_profiles` |
| `shop` | Signup | No | `shop_profiles` |

Stored in `profiles.role`. No admin role in MVP.

---

## 4. Database Schema

```
profiles (id, user_id, role, full_name, avatar_url, created_at, updated_at)
  ├── supplier_profiles (id, profile_id, business_name, ...)
  │     └── flower_products (id, supplier_id, name, price_per_unit, stock_qty, ...)
  └── shop_profiles (id, profile_id, business_name, credit_limit, current_balance, payment_terms, ...)
        └── cart_items (id, shop_id, product_id, quantity, ...)

product_categories (id, name, slug)

order_groups (id, shop_id, created_at)
  └── orders (id, order_group_id, supplier_id, shop_id, status, order_type, requested_delivery_date, ...)
        └── order_items (id, order_id, product_id, quantity, unit_price, ...)
              └── claims (id, order_item_id, shop_id, supplier_id, reason, requested_credit_amount, evidence_url_array, status, ...)
```

### Order statuses
`pending` → `confirmed` → `delivered`
`pending` → `cancelled`
`confirmed` → `cancelled`

That's it. No other statuses.

---

## 5. RLS Policies (Core)

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | Own | System (trigger) | Own | — |
| supplier_profiles | Public read | Own supplier | Own supplier | — |
| shop_profiles | Public read | Own shop | Own shop | — |
| flower_products | Public read | Own supplier | Own supplier | Own supplier |
| product_categories | All authed | Admin/seed | — | — |
| cart_items | Own shop | Own shop | Own shop | Own shop |
| order_groups | Own shop | Own shop | — | — |
| orders | Own shop + own supplier | System (checkout) | Own supplier (status only) | — |
| order_items | Via order access | System (checkout) | — | — |
| claims | Own shop + own supplier | Own shop | Own supplier (status only) | — |

---

## 6. Server Actions

| Action | File | Auth | Description |
|--------|------|------|-------------|
| `signUp` | `actions/auth.ts` | Public | Register with role selection |
| `signIn` | `actions/auth.ts` | Public | Magic link login |
| `getProfile` | `actions/profiles.ts` | Authed | Get own profile |
| `updateProfile` | `actions/profiles.ts` | Authed | Edit own profile |
| `createProduct` | `actions/products.ts` | Supplier | Add flower listing |
| `bulkCreateProducts` | `actions/products.ts` | Supplier | Batch insert from CSV |
| `updateProduct` | `actions/products.ts` | Supplier | Edit own product |
| `deleteProduct` | `actions/products.ts` | Supplier | Remove own product |
| `getProducts` | `actions/products.ts` | Any | Browse marketplace |
| `getProduct` | `actions/products.ts` | Any | Product detail |
| `addToCart` | `actions/cart.ts` | Shop | Add product to cart |
| `updateCartItem` | `actions/cart.ts` | Shop | Change quantity |
| `removeFromCart` | `actions/cart.ts` | Shop | Remove item |
| `getCart` | `actions/cart.ts` | Shop | View cart |
| `checkout` | `actions/orders.ts` | Shop | Create order group + orders |
| `getOrders` | `actions/orders.ts` | Authed | List orders (role-filtered) |
| `getOrder` | `actions/orders.ts` | Authed | Order detail |
| `updateOrderStatus` | `actions/orders.ts` | Supplier | Confirm or mark delivered |
| `cancelOrder` | `actions/orders.ts` | Authed | Cancel (with rules) |
| `submitClaim` | `actions/claims.ts` | Shop | Submit item quality claim |
| `resolveClaim` | `actions/claims.ts` | Supplier | Approve/Reject a claim |

---

## 7. Page Map

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── (dashboard)/
│   ├── supplier/
│   │   ├── products/
│   │   │   ├── page.tsx              # List own products
│   │   │   ├── new/page.tsx          # Add product
│   │   │   ├── import/page.tsx       # Bulk CSV upload & mapping
│   │   │   └── [id]/edit/page.tsx    # Edit product
│   │   └── orders/
│   │       ├── page.tsx              # Incoming orders
│   │       └── [id]/page.tsx         # Order detail + actions
│   └── shop/
│       ├── browse/
│       │   ├── page.tsx              # Marketplace browse
│       │   └── [id]/page.tsx         # Product detail
│       ├── cart/page.tsx             # Shopping cart
│       └── orders/
│           ├── page.tsx              # Order history
│           └── [id]/
│               ├── page.tsx          # Order detail
│               └── claim/page.tsx    # Quality claims form
```

---

## 8. Migration Sequence

```
001_create_profiles.sql
002_create_supplier_profiles.sql
003_create_shop_profiles.sql
004_create_product_categories.sql
005_create_flower_products.sql
006_create_cart_items.sql
007_create_order_groups.sql
008_create_orders.sql
009_create_order_items.sql
010_seed_product_categories.sql
011_create_rls_core.sql
012_create_auth_trigger.sql
013_marketplace_boost_schema.sql
```

13 migrations. That's it.

---

## 9. File Conventions

| Type | Path |
|------|------|
| Server Actions | `src/lib/actions/{domain}.ts` |
| Validators | `src/lib/validators/{domain}.ts` |
| DB client | `src/lib/supabase/server.ts`, `client.ts` |
| Auth middleware | `src/middleware.ts` |
| Types | `src/types/{domain}.ts` |
| Pages | `src/app/(dashboard)/{role}/{feature}/page.tsx` |
| Components | `src/components/{domain}/{ComponentName}.tsx` |
| Migrations | `supabase/migrations/{NNN}_{description}.sql` |

---

## 10. What Is NOT in MVP

- Drops, tiers, badges, referrals, showcases, trending (see `GROWTH_ARCHITECTURE_V2.md`)
- Real-time subscriptions
- Push notifications
- Email notifications
- Messaging between users
- Admin panel
- Analytics dashboard
- Payment processing (orders are placed, payment is offline for now)
- Image optimization pipeline

These are all future. None of them block shipping.

---

## 11. Definition of "Shipped"

All of the following work in production:

- [ ] Supplier signs up with role = supplier
- [ ] Supplier completes business profile
- [ ] Supplier adds flower products (single item and bulk CSV import)
- [ ] Shop signs up with role = shop
- [ ] Shop browses marketplace, sees product
- [ ] Shop adds to cart
- [ ] Shop checks out (creates order)
- [ ] Supplier sees incoming order
- [ ] Supplier confirms order
- [ ] Supplier marks order delivered
- [ ] Shop sees order status = delivered
- [ ] RLS prevents cross-role/cross-user data access
- [ ] No data leaks between suppliers or between shops

When all boxes are checked: you have shipped.
