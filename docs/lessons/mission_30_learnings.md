# Mission 30 Learnings: Backend Re-Engagement & Data Seeding

## Bug: `profiles.profile_id` does not exist
- **Symptom**: Communications migration failed with `column "profile_id" does not exist`
- **Root Cause**: The M27/M28/M29 overnight agents wrote RLS policies referencing `profiles.profile_id`, but the `profiles` table has `id` (not `profile_id`). The `profile_id` column exists on `shop_profiles` and `supplier_profiles` where it *references* `profiles.id`.
- **Fix**: Replace `select profile_id from public.profiles` with `select id from public.profiles` in all RLS policy subqueries.
- **Lesson**: When writing RLS policies that join across profile sub-tables, always verify column names against the actual schema. The naming convention (`profile_id` on sub-tables, `id` on `profiles`) is a common source of confusion.

## Issue: `.env.local` pointing to local Supabase
- **Symptom**: Dev server threw `ECONNREFUSED 127.0.0.1:54321` on every request
- **Root Cause**: `.env.local` had `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321` (local) but the anon key was for the cloud project.
- **Fix**: Updated URL to `https://axtpwvddwzsshgnekeys.supabase.co`
- **Lesson**: After parallel ADW sessions, always verify `.env.local` points to the correct Supabase instance before testing.

## Process: Seed SQL needs explicit profile inserts
- When seeding via direct SQL (not auth endpoints), the Supabase auth triggers may not fire. Always include explicit `INSERT INTO public.profiles ... ON CONFLICT DO NOTHING` and sub-profile inserts as a fallback.
