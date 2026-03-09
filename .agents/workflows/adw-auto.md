---
description: Runs autonomous ADW loop — agent selects missions from PLAN.md, builds, tests, and ships with confidence gating.
---
# /adw-auto

When the USER invokes `/adw-auto [count]`, execute the following protocol:

> **Purpose:** Fully autonomous development loop. The agent reads PLAN.md, picks the next mission(s), builds, verifies, and ships — looping until `count` missions are done or a confidence gate triggers human review.
>
> **Safety:** Every mission still runs through the full TEST phase. The human REVIEW gate is replaced by a **confidence score** — only missions scoring ≥8/10 auto-ship. Lower scores pause for human review.

## Auto-Mission Selector

1. Read `docs/PLAN.md` and parse the mission tracker:
   - Find all missions marked `[ ]` (pending).
   - Check the DAG (mermaid graph) for dependency ordering.
   - Select the **next unblocked mission** (all dependencies `[x]`).
   - If multiple missions are unblocked → pick the one with the smallest mission number.

2. If no pending missions exist → inform the user: *"All missions complete. Use `/feature` to plan new ones."*

## Autonomous Loop

3. For each mission (up to `count`, default 1):

   ### a. Initialize Session
   ```
   Create adw_state.json with:
     type: "autonomous"
     confidence_threshold: 8
     auto_ship: true
   ```

   ### b. Execute Phases
   - **CONTEXT** → Read project docs (`.agents/phases/context.md`)
   - **SUIT** → Load active suits (`.agents/phases/suit.md`)
   - **BUILD** → Implement the mission (`.agents/phases/build.md`)
   - **TEST** → Full verification gates (`.agents/phases/test.md`)
     - If TEST fails → auto-retry (max 2x per test.md rules)
     - If still failing after 2 retries → **STOP loop, notify user**

   ### c. Confidence Gate (replaces human REVIEW)
   After TEST passes, compute a **confidence score** (1-10):

   | Factor | Weight | Score Criteria |
   |--------|--------|---------------|
   | Test gates passed | 30% | All 4 gates = 10, missing gate = -3 each |
   | Files changed | 20% | <10 files = 10, 10-20 = 7, >20 = 5 |
   | Retries needed | 20% | 0 retries = 10, 1 = 6, 2 = 3 |
   | Schema changes | 15% | No migrations = 10, migrations = 5 |
   | Suit compliance | 15% | All gates pass = 10, per-failure = -2 |

   **Decision matrix:**
   ```
   IF confidence ≥ 8:
     → AUTO-SHIP (skip human review)
     → Log: "Auto-shipped with confidence {score}/10"

   IF confidence 5-7:
     → PAUSE for human review
     → Generate walkthrough with confidence breakdown
     → notify_user: "Confidence {score}/10 — please review before shipping"

   IF confidence < 5:
     → STOP the loop entirely
     → Generate detailed error report
     → notify_user: "Low confidence {score}/10 — needs human intervention"
   ```

   ### d. Ship (if auto-approved)
   - **LEARN** → Auto-lesson detection (`.agents/phases/learn.md`)
   - **SHIP** → Commit, push, update PLAN.md (`.agents/phases/ship.md`)
   - Archive `adw_state.json` to `.agents/history/`

   ### e. Loop
   - If `count > 1` and more pending missions exist → start next mission.
   - If paused for review → stop loop, wait for human.

## Audit Trail

4. Each autonomous session records additional fields in `adw_state.json`:
   ```json
   {
     "type": "autonomous",
     "confidence_score": 9,
     "confidence_breakdown": {
       "test_gates": 10,
       "files_changed": 8,
       "retries": 10,
       "schema_changes": 10,
       "suit_compliance": 8
     },
     "auto_shipped": true,
     "human_review_required": false,
     "auto_selected_mission": "M34"
   }
   ```

5. The human can audit any session post-hoc by reading `.agents/history/`.

## Safety Guardrails

> [!CAUTION]
> Auto-ship NEVER applies to:
> - Database migrations (schema changes always need human review)
> - RLS policy changes (security-critical)
> - Environment variable or secret changes
> - Changes to `.agents/` workflow files themselves (meta-changes)

If any of these are detected, force `confidence_score = 4` (automatic human review).

## Example Usage

```
/adw-auto 3
# Picks next 3 unblocked missions from PLAN.md
# Builds, tests, and ships each one autonomously
# Stops if any mission scores below threshold

Output:
  ✅ M34 — auto-shipped (confidence 9/10)
  ✅ M35 — auto-shipped (confidence 8/10)
  ⏸️ M36 — paused (confidence 6/10, migration detected) — review required
```
