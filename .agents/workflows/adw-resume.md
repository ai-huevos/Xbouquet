---
description: Resumes an ADW session from the last completed phase using adw_state.json.
---
# /adw-resume

When the USER invokes `/adw-resume`, execute the following protocol:

> **Purpose:** Resume a previously interrupted or failed ADW session. Picks up from the last completed phase.

## State Recovery

1. Read `adw_state.json` from the project root.
   - If it doesn't exist → inform the user: *"No active ADW session found. Run `/adw-start` to begin."*

2. Scan the `phases` object to find the first phase with `status != "completed"`:
   - This is the **resume point**.

3. Log the recovery: *"Resuming mission {mission_id} from {resume_phase} phase. Phases {completed_phases} already completed."*

## Phase Execution

4. Execute each remaining phase in order, starting from the resume point:
   - Read `.agents/phases/{phase_name}.md` for each phase.
   - Update `adw_state.json` after each phase completes.

5. Follow the same auto-retry and human gate rules as `/adw-start` and `/adw-finish`:
   - TEST phase has auto-retry (max 2)
   - REVIEW phase has human gate

## Example

```
adw_state.json shows:
  context: completed
  suit: completed  
  build: completed
  test: in_progress (retries: 1, last_error: "tsc: 3 errors")
  review: pending
  learn: pending
  ship: pending

/adw-resume → starts from TEST phase → auto-retries BUILD if needed → continues through REVIEW → LEARN → SHIP
```
