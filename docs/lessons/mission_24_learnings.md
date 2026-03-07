# Mission 24 Learnings: UX Visual Journey & Seeding Bugs

During the execution of Mission 24 (The Tandem Testing visual UX sweep), two major blockers were encountered that hydration and testing frameworks like Playwright completely missed.

## 1. Supabase GoTrue Auth Implicit NULL Scanning Bug

### The Issue
Navigating to the login page and attempting to manually log in via the UI continuously returned a `Database error querying schema` from the Supabase API. Playwright bypassed this during its E2E because it hit the API optimally, whereas the frontend Supabase auth client triggers deeper DB scans. 

### The Root Cause
The latest Supabase GoTrue Docker image (`v2.187.0`) enforces strict `NOT NULL` constraints across the `auth.users` row during standard frontend client queries. In earlier versions, injecting only `id`, `email`, `role`, and `password` via `seed.sql` was sufficient. Newer versions crash if underlying configuration tokens or history dates are left implicitly completely empty.

### The Solution
When manually injecting data into the `auth.users` schema in `supabase/seed.sql`, you **MUST** explicitly populate all string and timestamp token columns.
Example fix:
```sql
-- Required explicit fields for seeded 'auth.users' to prevent "Database error querying schema"
confirmation_token = '',
created_at = now(),
updated_at = now(),
email_change = '',
email_change_token_current = '',
email_change_token_new = '',
phone = '1111111111', -- Must be unique
phone_change = '',
phone_change_token = '',
recovery_token = ''
```

## 2. Next.js `<Image />` 404 Render Crash

### The Issue
When logging into the Shop marketplace, the Next.js frontend crashed entirely with a runtime execution error `upstream image response failed` and `Invalid src prop`.

### The Root Cause
The product seed script was initially using placeholder images from `images.unsplash.com`. Unsplash rate-limits and dynamically purges photo seeds. If a seeded Next `<Image />` component receives a `404 Not Found` from the source hostname, the Next.js `next/image` optimizing engine throws a hard server crash, bringing down the entire page rather than falling back gracefully.

### The Solution
1. Avoid `images.unsplash.com` for local, long-term database seeds unless using a guaranteed static asset path.
2. We moved to `https://picsum.photos/seed/{id}/{w}/{h}` which provides guaranteed, deterministic dummy image yields that do not 404.
3. Added the new domain block to the Next config:
```ts
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'picsum.photos',
    },
  ],
},
```
