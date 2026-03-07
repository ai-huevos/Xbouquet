# Mission 23: Complete Mobile Responsiveness Overhaul for Auth & Landing Pages

This mission focuses on fixing the mobile layout for the landing, login, and signup pages. The current layout breaks on mobile devices due to lack of safe-area padding, fixed heights, large typography, and overlapping absolute positioning.

## Proposed Changes

We will systematically update the Tailwind CSS classes across the auth and landing pages to ensure a premium mobile-responsive experience using standard `md:` and `lg:` breakpoints.

### Pages

#### [MODIFY] src/app/page.tsx
- Update outer page container to have responsive padding: `p-4 sm:p-6 lg:p-12`.
- Update the main glass panel to be auto-height on mobile and fixed height on desktop `h-auto lg:h-[80vh] min-h-[100dvh] lg:min-h-[650px]`.
- Fix the left floral-bg container padding and layout: `p-6 sm:p-8 lg:p-12 gap-8 lg:gap-0 justify-center lg:justify-between`.
- Scale typography responsively: `text-4xl lg:text-5xl` -> `text-3xl md:text-5xl lg:text-6xl`.
- Fix the absolute overlapping avatars: Use flex column on mobile or properly stack the "5,000+ businesses" text using `flex-col sm:flex-row items-start sm:items-center`.
- Adjust right-side action area padding: `p-6 sm:p-8 md:p-16`.

#### [MODIFY] src/app/(auth)/layout.tsx
- Similar outer container padding adjustments as `page.tsx`: `p-4 sm:p-6 lg:p-12`.
- Main glass panel dimensions: `h-auto lg:h-[80vh] min-h-[100dvh] lg:min-h-[650px] rounded-none sm:rounded-2xl` (Remove border radius on very small screens to maximize space).
- Right-side form area padding: `p-6 sm:p-8 md:p-12 lg:p-16`.
- Mobile Branding Header padding and typography adjustments for a compact, clean look.

#### [MODIFY] src/app/(auth)/login/page.tsx & src/app/(auth)/signup/page.tsx
- Scale heading typography: `text-3xl font-extrabold` to `text-2xl sm:text-3xl font-extrabold`.
- Optimize internal spacing/margins on forms (`space-y-4` and `space-y-5`) to fit well within mobile screens.
- Ensure inputs are easily tappable with `py-3` on mobile and `sm:py-3.5` on desktop.

## Verification Plan

### Automated Tests
- Run `npm run build` to verify no TypeScript or syntax errors.

### Manual Verification
- Render the local server using `npm run dev`.
- Use the Browser developer tools (device toolbar) to test across the following screen sizes:
  - iPhone 15 Pro / SE (width: ~375px - 390px)
  - iPad Mini (width: ~768px)
  - Desktop (width: 1440px)
- Specific checks:
  - Container does not bleed out of edges and does not have horizontal scrolling on mobile.
  - Buttons and inputs have comfortable touch targets.
  - Avatars do not overlap the text in the hero section.
  - The "Get Started" panel fits gracefully below the hero section on mobile, forming a single flex column.
