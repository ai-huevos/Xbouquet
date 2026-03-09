---
description: Starts an Agentic Development Workflow (ADW) session for a specific mission.
---
# /adw-start

When the USER invokes `/adw-start [mission_description_or_number]`, execute the following protocol:

> **This is a phase orchestrator.** Each step below corresponds to an atomic phase in `.agents/phases/`. Read the phase file for detailed instructions.

// turbo-all

## Trigger Queue Check

0. If `.agents/trigger-queue` exists and is non-empty:
   - Read the queued action and use the queued mission as the mission parameter.
   - Clear the queue file after reading.
   - This allows `/adw-triggers` (cron, webhook, file watch) to feed missions to the agent.

## State Initialization

1. Create or resume `adw_state.json` in the project root:
   ```json
   {
     "version": 1,
     "mission_id": "[from PLAN.md]",
     "mission_title": "[description]",
     "branch": "dev",
     "type": "feature",
     "started_at": "[ISO timestamp]",
     "current_phase": "context",
     "suits_active": [],
     "phases": {
       "context": { "status": "pending" },
       "suit": { "status": "pending" },
       "build": { "status": "pending" },
       "test": { "status": "pending" },
       "review": { "status": "pending" },
       "learn": { "status": "pending" },
       "ship": { "status": "pending" }
     },
     "suit_compliance": {}
   }
   ```
   - If `adw_state.json` already exists with incomplete phases, treat this as a resume (see `/adw-resume`).

## Branch Management

2. Run `git fetch && git checkout dev && git pull origin dev`

## Phase Execution

3. **Execute phase:** `.agents/phases/context.md` → Update `adw_state.json`
4. **Execute phase:** `.agents/phases/suit.md` → Update `adw_state.json`
5. **Execute phase:** `.agents/phases/build.md` → Update `adw_state.json`

## Checkpoint

6. Run `git add . && git commit -m "feat: [ADW] {mission_title}"`
7. Update `adw_state.json` → `current_phase = "committed"`

## Handoff

8. Call `notify_user` to present the completed work.
   - Summarize what was built and how it meets the Done Criteria.
   - Inform the user: *"Run `/adw-finish` to verify, review, and ship."*
