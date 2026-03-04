---
description: Finishes an ADW session, runs verifications, commits changes, and updates the global PLAN.md tracker.
---
# /adw-finish

When the USER invokes `/adw-finish`, execute the following protocol strictly:

1. **Verification Phase** (// turbo):
   - Run `npx tsc --noEmit` to ensure strict typing compliance.
   - Run `npx eslint .` to check for frontend linting issues.

2. **Commit & Sync Phase** (// turbo):
   - Run `git add .`
   - Run `git commit -m "chore: finalize current ADW mission"`
   - Run `git push origin dev`

3. **Status Update Phase**:
   - Open `/Volumes/deathstar/Development/Xpress Buke/PLAN.md` using the `multi_replace_file_content` tool.
   - Mark the current active mission as completed from `[ ]` to `[x]`.
   - Run `git add PLAN.md` and `git commit -m "docs: update PLAN.md tracker"` then `git push origin dev`.

4. **Deployment Handoff**:
   - Inform the user that the code has been successfully verified, committed, and pushed to the `dev` branch.
   - If this mission concludes a Wave, remind the user to open a Pull Request from `dev` to `main` via the GitHub UI, which will automatically trigger the Vercel production deployment.
