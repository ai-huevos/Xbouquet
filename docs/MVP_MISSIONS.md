Good.
We are now in **execution mode**.

These are **Antigravity review-driven missions** for the 7 core components only.

No growth systems.
No drops.
No tiers.
No referrals.
No showcases.
No trending.

Each mission:

* Fits one session
* Has hard constraints
* Has clear done criteria
* References ARCHITECTURE.md as source of truth

Use Review-Driven Mode only.

---

# MISSION 1 — Auth + Role Router

**Title:** Implement Auth + Server-Enforced Role Routing

```
Goal:
Implement Supabase authentication with role-based routing.

Requirements:
- Email/password signup
- Role selection during signup (supplier or shop)
- Create row in `profiles` with immutable role
- Create corresponding `supplier_profiles` or `shop_profiles`
- Middleware reads role server-side
- Redirect:
    supplier → /supplier/dashboard
    shop → /marketplace

Constraints:
- Role must never be stored in client state as source of truth
- All route protection must happen in middleware or server components
- Strict TypeScript
- Zod validation on signup input
- No UI polish

Pages:
- /login
- /signup

Done When:
- Supplier cannot access /shop/*
- Shop cannot access /supplier/*
- Direct URL manipulation blocked
- profiles.role cannot be modified after creation
```

Commit after completion.

---

# MISSION 2 — Supplier Product Manager (CRUD)

**Title:** Implement Supplier Product CRUD

```
Goal:
Allow suppliers to create and manage their flower products.

Requirements:
- /supplier/dashboard/products page
- List own products only
- Add product form
- Edit product
- Delete product
- Upload image to Supabase storage
- Fields:
    name
    description
    price_per_unit
    stock_qty
    category_id
    image_url

Constraints:
- All mutations via Server Actions
- Zod validation on input
- Supplier can only modify their own products
- RLS respected
- No optimistic updates
- No analytics
- No drops

Empty State:
- "Add your first product"

Done When:
- Supplier sees only their products
- Another supplier cannot edit via URL hack
- Product appears in public marketplace query
```

Commit.

---

# MISSION 3 — Marketplace Product Grid

**Title:** Build Marketplace Listing Page

```
Goal:
Allow shop users to browse all active products.

Requirements:
- /marketplace page
- Server-side data fetching
- Display:
    image
    name
    price_per_unit
    stock_qty
    supplier name
- Add to Cart button
- Basic search (name text filter)
- Optional: category filter

Constraints:
- No client-only fake data
- Must respect RLS
- Only show products with stock_qty > 0
- No pagination yet (unless trivial)
- No drops
- No tier UI

Empty State:
- "No products available yet"

Done When:
- Shop can add to cart in one click
- Supplier cannot modify product from this page
- Inventory reflects DB state
```

Commit.

---

# MISSION 4 — Product Detail Page

**Title:** Implement Product Detail View

```
Goal:
Allow shop users to view detailed product information before ordering.

Route:
- /marketplace/[productId]

Requirements:
- Large image
- Description
- Supplier name (linked to supplier profile page placeholder)
- Price per unit
- Quantity selector
- Add to Cart

Edge States:
- Out of stock
- Invalid product ID

Constraints:
- Data fetched server-side
- Zod param validation
- If product not found → 404
- No related products section
- No reviews

Done When:
- Shop can add arbitrary quantity up to stock
- Invalid ID does not crash page
```

Commit.

---

# MISSION 5 — Cart (Grouped by Supplier)

**Title:** Implement Cart System (Server-Backed)

```
Goal:
Allow shop users to manage cart items before checkout.

Requirements:
- cart_items table used as source of truth
- /cart page
- Group items by supplier
- Show:
    product name
    quantity
    unit price
    subtotal per supplier
    total
- Update quantity
- Remove item
- Stock validation on update

Constraints:
- All cart operations via Server Actions
- No localStorage-only cart
- If stock changes below selected qty → show error
- Must prevent negative quantity
- Must handle multi-supplier grouping

Done When:
- Cart reflects DB accurately
- Page refresh preserves cart
- No cross-account cart access
```

Commit.

---

# MISSION 6 — Checkout + Order Creation

**Title:** Implement Order Creation Flow

```
Goal:
Convert cart items into orders grouped per supplier.

Requirements:
- Checkout button on /cart
- On checkout:
    - Create order_group
    - Create one order per supplier
    - Create order_items
    - Decrement stock_qty atomically
    - Clear cart_items
    - Order status = 'pending'
- Redirect to confirmation page

Constraints:
- Entire transaction must be atomic
- Use transaction or RPC function
- Validate stock before decrement
- No payment integration
- No drops

Done When:
- Orders created correctly per supplier
- Stock decremented correctly
- Cart cleared
- Supplier sees order in dashboard
```

Commit.

---

# MISSION 7 — Order Dashboards (Both Roles)

**Title:** Implement Order Dashboards

```
Goal:
Close the transaction loop.

Supplier View:
- /supplier/dashboard/orders
- Show incoming orders
- Columns:
    order_id
    shop name
    total
    status
    created_at
- Update status: pending → fulfilled → cancelled

Shop View:
- /shop/orders
- Show order history
- View order detail

Constraints:
- Supplier sees only their orders
- Shop sees only their orders
- Status updates server-side
- No messaging
- No analytics
- No tiers

Done When:
- Supplier can mark order fulfilled
- Shop sees updated status
- RLS prevents cross-account access
```

Commit.

---

# FINAL HARDENING MISSION

After all 7:

---

# MISSION 8 — RLS Enforcement Validation

**Title:** Enforce and Test Row Level Security

```
Goal:
Ensure no cross-account data access possible.

Requirements:
- Enable RLS on all core tables
- Write explicit policies
- Test:
    - Supplier A cannot read Supplier B products
    - Shop A cannot read Shop B cart
    - Supplier cannot read unrelated orders
    - Shop cannot update order status
- Remove any temporary wide-open policies

Constraints:
- Default deny
- Explicit allow only
- No bypass

Done When:
- Manual SQL test attempts fail appropriately
- Application still functions correctly
```

Commit.

Deploy.

Stop building.

---

# What This Gets You

In ~7 focused sessions:

You have:

✔ Auth
✔ Supply
✔ Discovery
✔ Cart
✔ Orders
✔ Fulfillment
✔ Security

You have a real marketplace.