# Mission 25 Learnings: Auth States & Native Image Overhauls

## 1. The Checkout Redirect Loop Trap
**The Conflict:** When dealing with dual-layered checkouts (a generic static gateway for guests alongside an authenticated dashboard), using `next/navigation` middleware to secure routes operates blindly. 
**The Cause:** Our Global Auth Middleware intercepted *all* authenticated traffic trying to access `/login` and ruthlessly bounced them to `/shop/browse`. When our Checkout Gateway told active Shop users to "Log in to continue", they hit that middleware and instantly got looped back to the dashboard, trapping them.
**The Solution:** Never rely on static checkouts. E-commerce bottlenecks **must** be Server Components that dynamically check session state (`supabase.auth.getUser()`) before rendering a CTA. If a session is valid, instantly `redirect('/checkout/payment')` bypassing the gateway entirely.

## 2. Global Navigation State vs Fragmented Pages
**The Conflict:** Pages like `/cart` or `/checkout` were initially spun up as full-screen "islands," breaking the user's mental map of the application.
**The Cause:** Sub-pages had their own `<header>` elements hardcoded into their `page.tsx`, rather than bubbling up to the `(dashboard)/layout.tsx`. Furthermore, the primary `ShopHeader` had strict `hidden lg:flex` Tailwind rules, rendering it inaccessible to mobile testers.
**The Solution:** 
1. Use Layout shells (`layout.tsx`) strictly as the single source of truth for TopNav/Sidebars.
2. Strip individual `page.tsx` routes of headers.
3. Replace CSS `hidden` with `overflow-x-auto whitespace-nowrap` for responsive bottom/header navigation padding on smaller devices.

## 3. Remote Image Dependencies (Picsum/Unsplash)
**The Conflict:** Next.js `<Image>` component crashes hard (status 500) if a remote `<img src>` returns a 404 or fails its whitelist. Unsplash deprecates links periodically, and `picsum.photos` destroys product aesthetic immersion by generating random mountains instead of flowers.
**The Solution:** For essential seed data (like B2B mock items), *always* download raw high-quality stock SVGs/JPGs locally into `/public/seeds/`. Treat seed mock imagery as part of the source code to ensure 100% offline stability and domain control.
