---
description: "Phase: Implement the feature — write code, migrations, server actions, and UI components."
phase: build
order: 4
---
# 🔨 BUILD Phase

> **Purpose:** Execute the implementation plan. Write production code: database migrations, Server Actions, API routes, and Next.js UI components.

## Inputs
- `adw_state.json` → `mission_id`, `suits_active`
- PLAN phase output (implementation plan)
- SUIT phase output (active overlays for `/adw-start`)

## Steps

1. Call `task_boundary` to enter **EXECUTION** mode.
2. Apply any active suit `/adw-start` overlays (growth loop declaration, core drive targeting, behavioral trigger design, etc.).
3. Implement the feature according to the implementation plan:
   - Write database migrations (if needed)
   - Create/modify Server Actions
   - Build React components and pages
   - Update routes and navigation
4. Track files changed for the state file.

## State Transition
```json
{ "build": { "status": "completed", "files_changed": 14, "migrations_added": 1 } }
```

## Failure Mode
- If a build error occurs that the agent can fix → fix it and continue.
- If stuck on an architectural decision → pause and ask via `notify_user`.
- If this is a **retry** after TEST failure → focus only on fixing the specific test errors from `adw_state.json.phases.test.last_error`.
