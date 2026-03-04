# Xpress Buke — B2B Flower Marketplace

A two-sided B2B marketplace where suppliers list rare, exclusive flowers, and boutique shops browse and place wholesale orders.

## Tech Stack
- **Framework**: Next.js 15 (App Router, RSC, Server Actions)
- **Language**: TypeScript (strict)
- **Database/Auth**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **Styling**: Tailwind CSS v4

## Documentation & Architecture
- **Architecture**: `docs/ARCHITECTURE.md`
- **Growth Architecture**: `docs/GROWTH_ARCHITECTURE_V2.md`
- **Agentic Dev Plan**: `PLAN.md` (Contains the missions spanning 6 waves)

## Agentic Development Workflow (ADW)
This project is built using a deterministic AI handoff strategy ("101 Dev Sessions"). 

To manage missions with the AI agent:
- `/adw-start [mission_number]` - Sets up the environment, pulls latest from `dev`, reads architecture, and starts implementing the mission slice.
- `/adw-finish` - Runs typechecking (`tsc --noEmit`), linters, commits the work, pushes to `dev`, and updates the `PLAN.md` tracker.

## Development Setup
1. Clone the repo and `npm install`
2. Link Supabase: `npx supabase link --project-ref <your-ref>`
3. Run the development server:
```bash
npm run dev
```
