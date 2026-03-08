# Learning: React Hydration Mismatch from Browser Extensions

## Date
2026-03-08

## Problem
A React hydration error appeared in the browser console:
> "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties."

The diff showed `data-jetski-tab-id="1176942206"` being injected into the `<html>` tag.

## Root Cause
A browser extension called "Jetski" injects custom `data-*` attributes into the `<html>` element **before React hydrates**. The server renders `<html lang="en">`, but by the time the client hydrates, the DOM has `<html lang="en" data-jetski-tab-id="...">`. React detects this mismatch and throws a hydration error.

This is a **false positive** — it is NOT caused by our code. It can happen with any browser extension that modifies the DOM (dark-mode togglers, accessibility tools, tab managers, etc.).

## Fix
Added `suppressHydrationWarning` to the `<html>` and `<body>` tags in `src/app/layout.tsx`. This tells React to skip the attribute comparison for **only** these two elements (it does NOT suppress warnings for their children).

```tsx
<html lang="en" suppressHydrationWarning>
  <body className={...} suppressHydrationWarning>
```

## Why This Is Safe
- `suppressHydrationWarning` is the [officially recommended approach](https://nextjs.org/docs/messages/react-hydration-error) for root-level elements that may be modified by browser extensions or third-party scripts.
- It only suppresses the warning for the specific element, not its descendants.
- Next.js templates (e.g., `create-next-app` with dark mode) include this by default.

## Prevention Rule
**Always add `suppressHydrationWarning` to `<html>` and `<body>` in the root layout.** This should be part of every new Next.js project setup.
