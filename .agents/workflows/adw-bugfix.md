---
description: Surgical hotfix workflow — CONTEXT → BUILD → TEST → SHIP with no planning or review phase.
---
# /adw-bugfix

When the USER invokes `/adw-bugfix [bug_description]`, execute the following protocol:

> **Purpose:** Fast-track bug fixes. Skips planning and review. Uses `fix/bugs` branch. No schema changes allowed.

## State Initialization

1. Create `adw_state.json` with `type: "bugfix"`:
   ```json
   {
     "version": 1,
     "mission_id": "BF-{timestamp}",
     "mission_title": "[bug_description]",
     "branch": "fix/bugs",
     "type": "bugfix",
     "started_at": "[ISO timestamp]",
     "current_phase": "context"
   }
   ```

## Branch Management (// turbo)

2. Run `git fetch && git checkout fix/bugs && git pull origin fix/bugs && git merge dev`

## Phase Execution

3. **Execute phase:** `.agents/phases/context.md`
   - Focus on `docs/LESSONS.md` for related past bugs.
   - Skim `docs/ARCHITECTURE.md` for relevant component context.

4. **Execute phase:** `.agents/phases/build.md`
   - **Constraint:** No database migrations, no schema changes. Code fixes only.
   - Focus narrowly on the reported bug.

5. **Execute phase:** `.agents/phases/test.md`
   - Run gates only on affected routes/components, not the full app.
   - Suit gates are skipped for bugfixes (not applicable to hotfixes).

6. **Execute phase:** `.agents/phases/ship.md`
   - Push to `fix/bugs` branch (not `dev`).
   - Notify user to merge `fix/bugs → main → dev` when ready.
