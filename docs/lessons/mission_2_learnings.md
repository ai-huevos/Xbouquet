# Mission 2 Learnings: Supplier Product CRUD

**Date:** March 4, 2026
**Topic:** UI Component styling & Next.js Form Inputs

## Observations
- **Tailwind Dark Mode Classes:** When building the MVP forms, it's easy to accidentally use dark-mode text classes (like `text-white`) inside light-themed form inputs (`bg-white` or `bg-gray-50`). We caught this during user review when the `ProductForm` inputs rendered white-on-white.
- **Actionable Takeaway:** Until Mission 7 (UI Polish) officially establishes our global Color Tokens and system themes, we should aggressively stick to base Tailwind classes (`text-gray-900`, `border-gray-300`) for all functional components instead of mixing `white/10` and `backdrop-blur` utilities preemptively.

## Next Steps
- Mission 7 will explicitly resolve this by implementing a unified Stitch design system. 
- In future MVP missions (Mission 3, Mission 4), rely on generic un-styled HTML/Tailwind until functional flows are completely verified.
