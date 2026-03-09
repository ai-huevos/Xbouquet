# Xpress Buke — Lessons Learned

> Accumulated knowledge from ADW missions. Append new entries at the bottom.

---

## M2: Tailwind Dark Mode in Forms
When building MVP forms, avoid mixing dark-mode text classes (`text-white`) inside light-themed form inputs (`bg-white`). Stick to base Tailwind classes (`text-gray-900`, `border-gray-300`) until a global design system is established.

## M3: Client-Side CSV Parsing
Using `papaparse` directly in the browser avoids serverless payload limits and enables instant header exposure for column mapping. Use `z.coerce.number()` for safe CSV string-to-number conversion. Iterate `parsed.error.issues` not `parsed.error.errors`.

## M4: Supabase Join Types
When returning compound Supabase queries (product + supplier + category), define precise TypeScript interfaces (`FlowerProductWithSupplier`). The `as unknown as [Type]` assertion is necessary due to complex generated types. Abstract complex card UI into dedicated components to keep pages focused on data fetching.

## M5: RLS Silent Failures & Server Actions
**Critical**: RLS INSERT policies fail silently (HTTP 200, no rows inserted) when the required foreign key profile doesn't exist. The `handle_new_user()` trigger must create entries in *all* role-specific profile tables. Always check DB Triggers when RLS policies fail for new user roles.

Push interactive forms to Client Components (`useState`, `useTransition`) at the leaves of the render tree. Server Components cannot handle loading states without full page reloads.

## M7: Tailwind CSS v4 Animations
`animate-in fade-in zoom-in-95` from `tailwindcss-animate` don't work in v4 by default. Replace with standard `animation` + `@keyframes` CSS in `globals.css` for build stability.

## M8: Stripe & Playwright
- **Stripe**: `unit_amount` must be an integer (cents). Always use `Math.round(price * 100)`.
- **Next.js 15.2**: Middleware renamed to `proxy.ts` (export `proxy` function). Use `npx @next/codemod@canary middleware-to-proxy .`
- **Playwright**: Use `page.waitForLoadState('networkidle')` before asserting on JS-dependent pages. Use precise selectors (`text="Exact"`, `.locator('button', { hasText: '...' })`).

## M24: Seeding & Image Crashes
- **Supabase GoTrue**: Newer versions require all `auth.users` columns to be explicitly populated in `seed.sql` (confirmation_token, recovery_token, phone, etc.).
- **Next.js `<Image>`**: A 404 from a remote image source causes a hard server crash (not graceful fallback). Never use Unsplash for seed data — use `public/seeds/` local files.

## M25: Auth Redirects & Global Nav
- **Checkout Loop**: Never rely on static checkouts. Server Components must dynamically check session state before rendering CTAs. If session is valid, `redirect()` past the gateway.
- **Layout Shells**: Use `layout.tsx` as the single source of truth for navigation. Strip individual `page.tsx` of headers.
- **Seed Images**: Download local JPGs into `/public/seeds/` for 100% offline stability.

## M28: Git Worktrees & Schema
- `node_modules` and `.env.local` are NOT shared between worktrees. Must be installed/copied independently.
- Cannot checkout a branch already active in another worktree. Use `git checkout -b feature/branch origin/dev`.
- Order statuses use `text` + `CHECK` constraint (not enum) — easier to extend with `DROP CONSTRAINT` + `ADD CONSTRAINT`.

## M30: Post-Parallel Stabilization
- **Column naming**: `profiles` table has `id`, not `profile_id`. Sub-tables (`shop_profiles`, `supplier_profiles`) have `profile_id` referencing `profiles.id`. RLS policies must use the correct column.
- **Env mismatch**: After parallel ADW sessions, always verify `.env.local` points to the correct Supabase instance.
- **Seed SQL**: When seeding via direct SQL (not auth endpoints), auth triggers may not fire. Always include explicit profile INSERT fallbacks.

## General: React Hydration & Browser Extensions
Browser extensions (dark-mode togglers, tab managers) inject `data-*` attributes into `<html>` before React hydrates, causing false-positive hydration errors. Always add `suppressHydrationWarning` to `<html>` and `<body>` in the root layout.

## M32: Sticky Header + Dropdown Clipping
`backdrop-blur-lg` on a sticky header creates a new CSS stacking context. Absolutely-positioned dropdowns inside it get clipped even with high `z-index`. **Fix**: Use React `createPortal` to render dropdowns to `document.body`, computing position from `getBoundingClientRect()` in a `useEffect` (not during render — ESLint will flag ref access during render).

## M32: Supabase Join Returns Array
When using `.select('product:flower_products(id, name)')`, Supabase may return the joined relation as an **array** `[{id, name}]`, not a single object `{id, name}`. Always guard with `Array.isArray(item.product) ? item.product[0] : item.product`.

## M32: CSS Bar Charts — Percentage Heights
CSS `height: X%` only works when the parent has an explicit height. In flex layouts, the parent often collapses. Use pixel-based heights computed from a known max height instead: `Math.round((pct / 100) * maxHeightPx)`.

## M-STAGE3: Blueprint First, Model Second
**What happened:** ADW v2 relied 100% on LLM reading markdown instructions. Research (arXiv 2508.02721, TB-CSPN Architecture) confirmed this is an anti-pattern — "conflating semantic understanding with process orchestration." The LLM occasionally forgot to update `adw_state.json`, skipped phases, or computed confidence scores inconsistently.

**Root cause:** Asking the LLM to be both the kitchen manager AND the chef. Orchestration (state, git, scoring, phase ordering) should be deterministic code, not probabilistic instructions.

**Fix:** Built `.agents/cli/` — a TypeScript CLI that handles orchestration deterministically. The LLM is restricted to "Activities" (code writing, debugging, design decisions). State machine guarantees atomic writes, phase ordering, crash recovery. Confidence scoring is pure math, not mental math.

**Pattern:** Separate deterministic control flow (Temporal-style Workflows) from probabilistic LLM calls (Activities). Code drives the bus, LLM rides in the back writing code.

## M-STAGE3: Safety Overrides Work Correctly
**What happened:** CLI confidence scorer correctly scored 4/10 and forced human review for a session that modified `.agents/` files (meta-changes).

**Lesson:** The safety override system validates itself. Changes to the workflow system itself should always trigger human review — the meta-change detection is critical for preventing the agent from modifying its own rules autonomously.

## API Separation: Deno Edge Functions + Node.js TSC Coexistence
**What happened:** After creating Supabase Edge Functions in `supabase/functions/api/`, `npx tsc --noEmit` failed with ~30 errors — Deno URL imports (`https://deno.land/x/hono@...`) and `.ts` extension imports are invalid in Node.js TypeScript.

**Root cause:** The root `tsconfig.json` had `"include": ["**/*.ts"]` which also matched `supabase/functions/**/*.ts`. Edge Functions run in Deno with their own type system.

**Fix:** Add `"supabase/functions"` to `tsconfig.json` → `"exclude"`. Edge Functions have their own runtime and don't pass through Next.js compilation.

**Pattern:** When mixing runtimes (Node.js + Deno) in one repo, always partition via `tsconfig.json` excludes. Consider a separate `deno.json` or `tsconfig.json` in `supabase/functions/` for Deno-specific settings.

