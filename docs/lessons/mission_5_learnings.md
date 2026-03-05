# Mission 5 Learnings: Cart & Order Creation

## Architectural Roadblocks & Solutions

### 1. Supabase Row Level Security (RLS) Silent Failures
**The Problem:** Add To Cart operations were failing silently (returning HTTP 200 from the Server Action, but no rows were inserted into `cart_items`).
**The Cause:** The `cart_items` table has an RLS `INSERT` policy that requires the `shop_id` to exist in the `shop_profiles` table. The `handle_new_user()` Supabase Database Trigger (created in Mission 1) only provisioned profiles for newly signed-up *Suppliers*, completely ignoring *Shops*. Thus, shop users had no profile, violating RLS.
**The Fix:** Wrote a migration patch (`20260304000010_fix_auth_trigger_shop.sql`) to explicitly handle the `role = 'shop'` case during auth signup and create the corresponding `shop_profiles` entry.
**Takeaway:** Always check Database Triggers when RLS policies fail on newly registered distinct user roles. If a foreign key constraint or RLS policy depends on a profile table, guarantee its creation at the Auth layer.

### 2. Next.js Server Actions vs Server Components
**The Problem:** Attempting to use inline `onClick` or `onSubmit` form handlers directly within a Server Component caused execution context issues and lacked user feedback.
**The Cause:** Server Components cannot handle complex client-side interactivity or loading states natively without fully reloading the page or losing hydration.
**The Fix:** Extracted the "Add To Cart" form into a dedicated Client Component (`AddToCartForm.tsx`). This pattern leverages `useState` and `useTransition` to provide immediate loading spinners, manage arbitrary UI quantities locally, and properly await the Server Action execution before router refresh.
**Takeaway:** Push user-interactive forms to Client Components at the leaves of the render tree, passing Server Actions down as props or importing them directly to maintain clean separation of interactivity and backend logic.
