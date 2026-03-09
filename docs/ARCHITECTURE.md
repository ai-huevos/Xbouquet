# Xpress Buke — Architecture (MVP Core)

> Last updated: 2026-03-07
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
| Auth | Supabase Auth (email + password) |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage (product images) |
| Payments | Stripe Checkout (session-based) |
| Security | Row Level Security on every table |
| Hosting | Vercel |
| Styling | Tailwind CSS v4 |
| Validation | Zod |
| Data Ingestion | Papaparse (CSV parsing & column mapping) |
| Testing | Playwright (E2E) |

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
  │     └── flower_products (id, supplier_id, name, price_per_unit, stock_qty, box_type, ...)
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

### Order types
`one_time` | `pre_book` | `standing`

### Box types
`QB` (Quarter Box) | `HB` (Half Box) | `FB` (Full Box)

### B2B Payment terms
`cod` (Cash on Delivery) | `net_15` | `net_30` | `put_on_account`

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
| `signIn` | `actions/auth.ts` | Public | Email/password login |
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
├── page.tsx                          # Landing page (public)
├── (auth)/
│   ├── layout.tsx                    # Auth layout shell
│   ├── login/page.tsx                # Email/password login
│   └── signup/page.tsx               # Signup with role selection
├── (dashboard)/
│   ├── supplier/
│   │   ├── layout.tsx                # Supplier nav shell (SupplierNav sidebar)
│   │   ├── page.tsx                  # Supplier dashboard home
│   │   ├── products/
│   │   │   ├── page.tsx              # List own products (ProductList)
│   │   │   ├── new/page.tsx          # Add product (ProductForm)
│   │   │   ├── import/page.tsx       # Bulk CSV upload & mapping
│   │   │   └── [id]/edit/page.tsx    # Edit product (ProductForm)
│   │   ├── orders/
│   │   │   └── page.tsx              # Incoming orders list
│   │   └── claims/
│   │       └── page.tsx              # View & resolve quality claims
│   └── shop/
│       ├── layout.tsx                # Shop nav shell (ShopHeader + UserMenuDropdown)
│       ├── page.tsx                  # Shop dashboard home
│       ├── browse/
│       │   ├── page.tsx              # Marketplace product grid
│       │   └── [id]/page.tsx         # Product detail + AddToCartForm
│       ├── cart/page.tsx             # Shopping cart (CartItemControls)
│       ├── orders/
│       │   └── page.tsx              # Order history
│       └── claims/
│           └── new/page.tsx          # Submit quality claim form
├── checkout/
│   ├── layout.tsx                    # Checkout layout
│   ├── gateway/page.tsx              # Auth-aware checkout gateway
│   ├── payment/page.tsx              # Stripe checkout session
│   └── success/page.tsx              # Order confirmation
└── api/
    └── ...                           # API route (Stripe webhook, etc.)
```

---

## 8. Component Map

```
src/components/
├── cart/
│   ├── AddToCartForm.tsx             # Quantity selector + add-to-cart button
│   └── CartItemControls.tsx          # In-cart quantity update/remove
├── checkout/
│   └── CheckoutForm.tsx              # Full checkout form with payment method selection
├── layout/
│   ├── ShopHeader.tsx                # Sticky top nav for shop (cart badge, nav links)
│   └── UserMenuDropdown.tsx          # User avatar dropdown (profile, logout)
├── products/
│   ├── MarketplaceProductCard.tsx    # Product card for browse grid
│   ├── ProductForm.tsx               # Supplier product create/edit form
│   └── ProductList.tsx               # Supplier product list with actions
└── supplier/
    ├── ColumnMapper.tsx              # CSV column mapping UI
    ├── CsvUploader.tsx               # CSV file upload handler
    ├── ImportFlow.tsx                # Multi-step import wizard container
    ├── ImportReview.tsx              # Review & confirm mapped data
    └── SupplierNav.tsx               # Sidebar navigation for supplier
```

---

## 9. Migration Sequence

```
20260303000001_create_profiles.sql
20260303000002_create_supplier_profiles.sql
20260303000003_create_shop_profiles.sql
20260303000012_create_auth_trigger.sql
20260304000004_create_product_categories.sql
20260304000005_create_flower_products.sql
20260304000006_setup_storage.sql
20260304000007_fix_auth_trigger_supplier.sql
20260304000008_create_cart_items.sql
20260304000009_create_orders.sql
20260304000010_fix_auth_trigger_shop.sql
20260305000001_rls_enforcement.sql
20260307000001_marketplace_boost_schema.sql
```

13 migrations total.

---

## 10. File Conventions

| Type | Path |
|------|------|
| Server Actions | `src/lib/actions/{domain}.ts` |
| Validators | `src/lib/validators/{domain}.ts` |
| DB client | `src/lib/supabase/server.ts`, `client.ts`, `middleware.ts` |
| Stripe client | `src/lib/stripe.ts` |
| Auth middleware | `src/proxy.ts` (Next.js 15.2+ proxy pattern) |
| Types | `src/types/{domain}.ts` |
| Pages | `src/app/(dashboard)/{role}/{feature}/page.tsx` |
| Components | `src/components/{domain}/{ComponentName}.tsx` |
| Migrations | `supabase/migrations/{YYYYMMDDNNNNNN}_{description}.sql` |
| Seed data | `public/seeds/` (local floral photos) |
| E2E tests | `e2e/` |

---

## 11. What Is NOT in MVP

- Drops, tiers, badges, referrals, showcases, trending (see `GROWTH.md`)
- Real-time subscriptions
- Push notifications
- Email notifications
- Messaging between users
- Admin panel
- Analytics dashboard
- Image optimization pipeline
- Standing order auto-generation cron

These are all future. None of them block shipping.

---

## 12. Definition of "Shipped"

All of the following work in production:

- [x] Supplier signs up with role = supplier
- [x] Supplier completes business profile
- [x] Supplier adds flower products (single item and bulk CSV import)
- [x] Shop signs up with role = shop
- [x] Shop browses marketplace, sees products
- [x] Shop adds to cart
- [x] Shop checks out (creates order)
- [x] Supplier sees incoming order
- [x] Supplier confirms order
- [x] Supplier marks order delivered
- [x] Shop sees order status = delivered
- [x] RLS prevents cross-role/cross-user data access
- [x] No data leaks between suppliers or between shops
- [ ] Deployed to production with real domain
- [ ] 5 real suppliers onboarded
- [ ] 10 real shops onboarded
