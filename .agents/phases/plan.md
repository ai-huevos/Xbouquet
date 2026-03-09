---
description: "Phase: Break down the feature into actionable steps and generate an implementation plan."
phase: plan
order: 2
---
# 📐 PLAN Phase

> **Purpose:** Decompose the mission into specific, actionable steps. Generate an implementation plan that covers UI, schema, backend, and routes.

## Inputs
- `adw_state.json` → `mission_id`, `mission_title`
- CONTEXT phase output (project docs loaded)

## Steps

1. Call `task_boundary` to enter **PLANNING** mode.
2. Break the mission into specific, actionable implementation steps.
3. Draft a comprehensive design covering:
   - UI/UX components needed
   - Database schema extensions and RLS policies (if any)
   - Server Actions and backend logic
   - Route changes or new pages
4. Generate the implementation plan as an `implementation_plan.md` artifact.
5. **CRITICAL**: Append the feature as a new numbered mission under the appropriate Wave in `docs/PLAN.md` (if not already present).

## State Transition
```json
{ "plan": { "status": "completed", "plan_artifact": "implementation_plan.md", "steps_count": 8 } }
```

## Human Gate
- After generating the plan, call `notify_user` for review.
- Wait for explicit approval before proceeding to BUILD.

## Failure Mode
- If the mission scope is unclear → ask for clarification via `notify_user`, do not guess.
