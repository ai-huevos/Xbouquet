# Mission 8 Learnings: Stripe Integration & Playwright

## Key Takeaways
1. **Stripe API Versioning:** Ensure the `apiVersion` specified in the Stripe client initialization exactly matches the version expected by the `@types/stripe` package. Next.js production builds will fail the typecheck rigorously if there's a mismatch (e.g. `'2025-02-24.acacia'` vs `'2026-02-25.clover'`).
2. **Next.js Middleware vs E2E Tests:** Playwright testing against routes protected by Next.js middleware (like our checkout flow which forces login/signup) requires an authenticated context and a seeded database. Rather than building a complex mock setup prematurely, standard practice is to use Playwright's `test.skip()` or build a dedicated database seeder for test environments.
3. **Playwright Port Conflicts:** Running Playwright tests on port 3000 can conflict with a developer's existing `npm run dev` server or lock the `.next` directory. Running against a distinct port (e.g., `3001`) and using `npm run start` (production web server) avoids these Next.js lockfile conflicts and ensures a clean test execution environment.
