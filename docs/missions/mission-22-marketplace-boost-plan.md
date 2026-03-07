# Implementation Plan: Marketplace Boost Logic Wiring

This plan details how we will integrate the UI screens generated via Stitch MCP (Phase 2) into the existing Xpress Buke architecture (frontend React/Next.js and backend Supabase/PostgreSQL).

## User Review Required
> [!IMPORTANT]
> - Do you want the `credit_limit` enforcement to be a hard block (Shops cannot place orders over limit), or a soft request that Suppliers must manually approve? (Assuming hard block for this plan).
> - Should Standing Orders generate all future orders immediately in the DB as "pending", or use a cron job to generate the next order a week before delivery? (Assuming cron job generation for this plan).

---

## Proposed Changes

### 1. Database Schema Migrations
We need to extend the current `flower_products`, `orders`, and `shop_profiles` tables, and introduce a new `claims` table.

#### [NEW] `supabase/migrations/20260307000001_marketplace_boost_schema.sql`
- **Profiles Extension:** Add `credit_limit`, `current_balance`, and `payment_terms` to `shop_profiles`.
- **Product Packaging:** Add `box_type` (enum: QB, HB, FB), `stems_per_bunch`, and `stem_length_cm` to `flower_products`.
- **Order Logistics:** Add `order_type` (enum: immediate, prebook, standing) and `requested_delivery_date` (timestamptz) to `orders`.
- **Claims Creation:** Create a new `claims` table linking `order_item_id`, `reason` (enum), `requested_credit_amount`, `description`, `evidence_url_array`, and `status`. Apply RLS policies (Shops can insert, Suppliers can update).

### 2. Supplier Product Packaging Extension
Integrate the specific Packaging UI into the Supplier dashboard.

#### [MODIFY] `src/types/products.ts`
- Extend the `FlowerProduct` interface to include the new packaging properties.

#### [MODIFY] `src/app/(dashboard)/supplier/products/new/page.tsx` (Assumed path based on PLAN)
- Embed the Stitch MCP generated `Supplier Packaging Logistics Component`.
- Wire the form inputs to the `createProduct` Server Action.

### 3. Shop Checkout Logistics & B2B Terms
Integrate the dual-step checkout: Delivery scheduling and Payment Terms.

#### [MODIFY] `src/app/(dashboard)/shop/cart/page.tsx`
- Refactor the Cart view to display the exact Box Type and total stems calculated from the product constraints.

#### [MODIFY] `src/app/checkout/page.tsx`
- **Step 1:** Implement the Stitch MCP `Checkout Delivery Logistics Component` to capture `order_type` and `requested_delivery_date` in the checkout state context.
- **Step 2:** Implement the Stitch MCP `B2B Payment Terms Component`.
- Wire the "Put on Account" button to validate against the shop profile's `credit_limit` vs `current_balance`.

#### [MODIFY] `src/lib/actions/checkout.ts` (Assumed)
- Update the `createOrder` sequence to parse the new logistics dates.
- Add logic to decrement `shop_profiles.current_balance` if "Put on Account" is selected, wrapping the order creation in a Postgres transaction.

### 4. Quality Claims Management
Build the new claims interaction module.

#### [NEW] `src/app/(dashboard)/shop/orders/[id]/claim/page.tsx`
- Implement the Stitch MCP `Shop Quality Claims Component`.
- Add Supabase Storage upload functionality for the "Photo Evidence" dropzone.

#### [NEW] `src/lib/actions/claims.ts`
- Create Server Actions to `submitClaim` (Shop) and `resolveClaim` (Supplier).

---

## Verification Plan

### Automated Tests
1. **DB Migration Test:** Apply the new migration file against the local Supabase instance to ensure no syntax or relation errors.
2. **Type Checking:** Run `npm run typecheck` to ensure the extended `FlowerProduct` and `ShopProfile` types do not break existing components.

### Manual Verification
1. **Packaging Extensibility:** Log in as a Supplier -> Add Product -> Ensure QB/HB/FB and stems/length are saved and displayed correctly on the shop marketplace.
2. **Checkout Routing:** Log in as a Shop -> Add to Cart -> Proceed to Checkout -> Select "Standing Order" + "Net 30" -> Verify the DB creates the correct order record and deducts the available credit balance.
3. **Claims Flow:** As a Shop, navigate to a past order -> Submit a Botrytis claim with a photo -> Log in as that order's Supplier -> Verify the claim appears in the dashboard with the image attached.
