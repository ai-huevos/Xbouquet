---
description: Finishes an ADW session, runs verifications, commits changes, and updates the global PLAN.md tracker.
---
# /adw-finish

When the USER invokes `/adw-finish`, execute the following protocol strictly:

1. **Verification Phase** (// turbo):
   - Run `npx tsc --noEmit` to ensure strict typing compliance.
   - Run `npx eslint .` to check for frontend linting issues.
   - Run `npx playwright test` (if applicable) to ensure E2E functional correctness.

2. **Testing & Visual Evidence Phase**:
   - Use the `browser_subagent` tool to test the newly built feature flow manually.
   - The browser subagent will automatically generate a WebP video recording of the session.
   - Generate a `walkthrough.md` artifact that documents the changes made, what was tested, and embed the generated recording/screenshots as visual evidence.

3. **Knowledge Capture Phase**:
   - If you encountered any significant bugs, architectural roadblocks, or useful learnings during this mission, create or append to a file in `docs/lessons/`.
   - Use the format `docs/lessons/mission_{number}_learnings.md`. This ensures future agents have explicit context on past mistakes.

4. **Commit & Sync Phase** (// turbo):
   - Run `git add .`
   - Run `git commit -m "chore: finalize current ADW mission"`
   - Run `git push origin dev`

3. **Status Update Phase**:
   - Open `docs/PLAN.md` using the `multi_replace_file_content` tool.
   - Mark the current active mission as completed from `[ ]` to `[x]`.
   - Run `git add docs/PLAN.md` and `git commit -m "docs: update PLAN.md tracker"` then `git push origin dev`.

4. **Deployment Handoff**:
   - Inform the user that the code has been successfully verified, committed, and pushed to the `dev` branch.
   - If this mission concludes a Wave, remind the user to open a Pull Request from `dev` to `main` via the GitHub UI, which will automatically trigger the Vercel production deployment.
