---
description: "Phase: Generate visual evidence and walkthrough documentation of the completed work."
phase: review
order: 6
---
# 👁️ REVIEW Phase

> **Purpose:** Create proof of work. Generate visual evidence, document what was built, and present to the human for approval.

## Inputs
- `adw_state.json` → `mission_id`, `suit_compliance`
- TEST phase output (browser recordings, test results)

## Steps

1. Generate a `walkthrough.md` artifact documenting:
   - What was built and why
   - Files changed with diffs
   - Visual evidence (embedded screenshots/recordings from TEST phase)
   - Test results summary

2. If suits are active, add a **## Suit Compliance** section:
   - For each active suit, show the checklist results from `adw_state.json.suit_compliance`
   - Note any advisory failures (suit gates are non-blocking but documented)

3. **Human Gate:** Call `notify_user` to present the walkthrough.
   - Provide a clear summary of what was built
   - Show how it meets the "Done Criteria" from PLAN.md
   - Explain how the user can test it locally
   - Wait for explicit user validation before proceeding

## State Transition
```json
{ "review": { "status": "completed", "walkthrough_artifact": "walkthrough.md", "user_approved": true } }
```

## Failure Mode
- If user rejects → return to BUILD with feedback, update `adw_state.json` accordingly.
- If user requests changes → treat as new BUILD iteration, not a failure.
