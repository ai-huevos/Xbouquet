# Mission 7 Learnings

## Tailwind CSS v4 & Animations
- **Issue**: Attempting to use `animate-in fade-in zoom-in-95` classes in `globals.css` with Tailwind CSS v4 resulted in a build error (`Cannot apply unknown utility class fade-in`).
- **Context**: These utilities are typically provided by custom plugins (like `tailwindcss-animate`) or require specific configuration in v4, which wasn't available by default in our setup.
- **Resolution**: Replaced the unresolved `@apply` utilities with standard `animation` and `@keyframes` CSS directly in `globals.css` to achieve the `animate-enter` effect without relying on external plugins. This provides better stability and build confidence in the v4 paradigm.
