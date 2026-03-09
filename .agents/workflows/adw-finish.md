---
description: Finishes an ADW session, runs verifications, commits changes, and updates the global PLAN.md tracker.
---
# /adw-finish

When the USER invokes `/adw-finish`, execute the following protocol strictly:

1. **Verification Phase** (// turbo):
   - Run `npx tsc --noEmit` to ensure strict typing compliance.
   - Run `npx eslint .` to check for linting issues.

2. **Visual Evidence Phase**:
   - Use the `browser_subagent` tool to test the newly built feature flow as a human would.
   - The browser subagent will automatically generate a WebP video recording.
   - Generate a `walkthrough.md` artifact documenting changes, what was tested, and visual evidence.

3. **Knowledge Capture**:
   - If significant bugs or architectural learnings were encountered, append a new section to `docs/LESSONS.md`.

4. **Commit & Sync** (// turbo):
   - Run `git add .`
   - Run `git commit -m "chore: finalize current ADW mission"`
   - Run `git push origin dev`

5. **Status Update**:
   - Open `docs/PLAN.md` and mark the current mission as completed (`[ ]` → `[x]`).
   - Run `git add docs/PLAN.md` and `git commit -m "docs: update PLAN.md tracker"` then `git push origin dev`.

6. **Deployment Handoff**:
   - Inform the user that code has been verified, committed, and pushed to `dev`.
   - If this mission concludes a Wave, remind the user to open a PR from `dev` to `main`.
