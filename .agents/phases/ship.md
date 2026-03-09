---
description: "Phase: Commit, push, update PLAN.md tracker, and hand off for deployment."
phase: ship
order: 8
---
# 🚀 SHIP Phase

> **Purpose:** Finalize the mission. Commit all changes, push to remote, update the mission tracker, and inform the user about deployment.

## Inputs
- `adw_state.json` → `mission_id`, `branch`
- All previous phases completed

## Steps

// turbo-all

1. **Commit** all changes:
   - `git add .`
   - `git commit -m "feat: [ADW Mission] {mission_title}"`

2. **Push** to remote:
   - `git push origin {branch}`

3. **Update tracker:**
   - Open `docs/PLAN.md` and mark the current mission as completed (`[ ]` → `[x]`).
   - `git add docs/PLAN.md`
   - `git commit -m "docs: update PLAN.md — {mission_id} completed"`
   - `git push origin {branch}`

4. **Finalize state:**
   - Update `adw_state.json` → all phases `"completed"`, add `completed_at` timestamp.
   - `git add adw_state.json`
   - `git commit -m "chore: finalize adw_state for {mission_id}"`
   - `git push origin {branch}`

5. **Archive state** (for `/adw-metrics`):
   - `cp adw_state.json .agents/history/adw_state_{mission_id}_{timestamp}.json`
   - `rm adw_state.json`
   - `git add .agents/history/ && git commit -m "chore: archive adw_state for {mission_id}" && git push origin {branch}`

6. **Deployment handoff:**
   - Inform the user that code has been verified, committed, and pushed.
   - If this mission concludes a Wave, remind the user to open a PR from `dev` to `main`.

## State Transition
```json
{ "ship": { "status": "completed", "commit_sha": "abc123", "pushed_to": "dev" } }
```

## Failure Mode
- If push fails (auth, network) → retry once, then notify user.
- If PLAN.md update conflicts → notify user to resolve manually.
