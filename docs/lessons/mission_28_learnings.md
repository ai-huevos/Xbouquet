# Mission 28 Learnings

## Git Worktree Environment Setup
- When using `git worktree` for parallel missions, `node_modules` and `.env.local` are **not** shared with the parent worktree. They must be installed/copied independently.
- The `dev` branch cannot be checked out if it is already active in another worktree. Use `git checkout -b feature/branch origin/dev` to create from remote.

## Database Schema
- The `user_role` enum type only contains `'supplier'` and `'shop'`. Adding `'admin'` requires `ALTER TYPE user_role ADD VALUE 'admin'` which is a non-reversible DDL change in Postgres.
- Order statuses are stored as a `text` column with a `CHECK` constraint (not an enum), making it easier to add new values via `DROP CONSTRAINT` + `ADD CONSTRAINT`.

## Docker Dependency
- Local Supabase (`npx supabase start`) requires Docker Desktop to be running. In overnight ADW sessions, Docker may not be started, blocking visual testing.
- Recommendation: For overnight runs, consider having the `.env.local` point to the remote Supabase project URL instead of `http://127.0.0.1:54321`.
