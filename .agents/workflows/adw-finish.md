---
description: Finishes an ADW session — runs verification gates, generates evidence, captures lessons, and ships.
---
# /adw-finish

When the USER invokes `/adw-finish`, execute the following protocol:

> **This is a phase orchestrator.** Each step below corresponds to an atomic phase in `.agents/phases/`. Read the phase file for detailed instructions.

## State Check

1. Read `adw_state.json`. Verify that BUILD phase is completed. If not, inform the user to run `/adw-start` first.

## Phase Execution

2. **Execute phase:** `.agents/phases/test.md` → Update `adw_state.json`
   - If TEST fails, the test phase has **auto-retry logic** (max 2 retries):
     - Return to `.agents/phases/build.md` to fix errors
     - Re-run `.agents/phases/test.md`
     - If still failing after 2 retries, notify user

3. **Execute phase:** `.agents/phases/review.md` → Update `adw_state.json`
   - This phase has a **human gate** — waits for user approval
   - If user rejects, return to BUILD phase with feedback

4. **Execute phase:** `.agents/phases/learn.md` → Update `adw_state.json`

5. **Execute phase:** `.agents/phases/ship.md` → Update `adw_state.json`
