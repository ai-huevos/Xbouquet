---
description: Runs multiple ADW missions in parallel using Git worktrees for isolation.
---
# /adw-parallel

When the USER invokes `/adw-parallel [mission_1] [mission_2] [...]`, execute the following protocol:

> **Purpose:** Launch multiple ADW missions simultaneously using Git worktrees. Each mission runs in an isolated filesystem with its own `adw_state.json`.

## Prerequisites Check

1. Verify missions are **parallelizable** — check `docs/PLAN.md` DAG:
   - Missions on **separate branches** of the dependency graph are safe to parallelize.
   - Missions with **shared dependencies** (e.g., both touch the same table) must NOT run in parallel.
   - If unsafe → warn the user and suggest sequential execution.

## Worktree Setup (// turbo)

2. For each mission, create a Git worktree:
   ```bash
   git worktree add ../xb-{mission_id} dev
   ```

3. For each worktree, **critical setup** (from LESSONS M28):
   - Copy `.env.local` into the worktree (`cp .env.local ../xb-{mission_id}/`)
   - Run `npm install` in the worktree (`cd ../xb-{mission_id} && npm install`)
   - These are NOT shared between worktrees — always copy manually.

4. For each worktree, create a feature branch:
   ```bash
   cd ../xb-{mission_id} && git checkout -b feature/{mission_id}
   ```

## Parallel Execution

5. Initialize `adw_state.json` in **each** worktree with:
   ```json
   {
     "version": 1,
     "mission_id": "{mission_id}",
     "mission_title": "{description}",
     "branch": "feature/{mission_id}",
     "type": "parallel",
     "worktree_path": "../xb-{mission_id}",
     "parent_session": "{main_mission_id}",
     "started_at": "[timestamp]",
     "current_phase": "context"
   }
   ```

6. Inform the user that worktrees are ready. Each worktree can be worked on by:
   - A separate IDE agent session (open the worktree folder)
   - Or sequentially in the same session

## Convergence Protocol

7. When all parallel missions are complete, merge them back:
   ```bash
   # Return to main repo
   cd /Volumes/deathstar/Development/Xpress\ Buke

   # Merge each feature branch
   git merge feature/{mission_1} --no-ff -m "merge: {mission_1} from parallel ADW"
   git merge feature/{mission_2} --no-ff -m "merge: {mission_2} from parallel ADW"

   # Clean up worktrees
   git worktree remove ../xb-{mission_1}
   git worktree remove ../xb-{mission_2}
   ```

8. **Conflict Resolution:**
   - If merge conflicts occur, they will be in **separate files** (because we verified parallelizability).
   - If conflicts are in the **same file** (rare, means DAG check was wrong) → notify user for manual resolution.

## Post-Merge Verification

9. Run the TEST phase on the merged result:
   - Execute `.agents/phases/test.md` — full verification including suit gates.
   - If tests fail → debug the integration points between the merged missions.

## Example Usage

```
/adw-parallel M27 M28 M29

# Creates:
#   ../xb-M27/  (Communications & Notifications)
#   ../xb-M28/  (Logistics & Governance)
#   ../xb-M29/  (Analytics & Financials)
#
# Each worktree has: .env.local, node_modules, own branch, own adw_state.json
# After all 3 complete → merge back → run TEST → push
```
