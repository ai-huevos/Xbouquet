# Mission 8 Learnings: Stripe & Next.js Playwright Integration

## 1. Stripe Checkout Intricacies
*   **Integer Conversion:** Stripe strictly requires `unit_amount` to be an integer (in cents). Directly passing dollar amounts with decimals (e.g., `12.50`) throws a `400 Invalid Integer` constraint error. Always use `Math.round(price * 100)` before appending to Stripe Line Items.
*   **Next.js Server Actions with Stripe:** When dealing with server actions that dynamically generate Stripe forms or redirect headers, verify that the environment parameters injected by the test runner aren't replacing the actual `STRIPE_SECRET_KEY` entirely (as experienced with `playwright.config.ts` overwriting keys with `sk_test_dummy`).

## 2. Next.js 15 File Convention Deprecations
*   **Middleware Renaming:** Next.js 15.2 (Canary/Latest) actively deprecates the `middleware.ts` file convention and requests renaming it to `proxy.ts` (exporting a `proxy` function). This is purely a naming semantic change to distinguish it from traditional Express.js middleware and avoid "overloaded" responsibilities. You can resolve this automatically using: `npx @next/codemod@canary middleware-to-proxy .`

## 3. Playwright Selectors & React Hydration
*   **Hydration Mismatches in E2E:** If Playwright clicks elements too rapidly before React has hydrated client-side Javascript (particularly on standard `<form>` submissions with Server Actions), the clicks will be ignored or caught by default HTML behaviors. 
*   **Solution:** Use `await page.waitForLoadState('networkidle')` before asserting interaction on complex JS-dependent pages (like Auth or Checkout flows) to assure stability.
*   **Selector Precision:** Rely on `text="Exact Node Content"` or `.locator('button', { hasText: '...' })` instead of broad selectors when navigating pages loaded with similar UI elements (e.g., multiple floating action buttons or auth toggles).
