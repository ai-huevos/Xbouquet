---
description: "Phase: Read project documentation to establish context for the current mission."
phase: context
order: 1
---
# 🔍 CONTEXT Phase

> **Purpose:** Load all project knowledge before any work begins. This phase ensures the agent has full situational awareness.

## Inputs
- `adw_state.json` → `mission_id`, `mission_title`

## Steps

1. Read `docs/PLAN.md` to map the current mission and understand its scope, dependencies, and done criteria.
2. Read `docs/ARCHITECTURE.md` to establish technical anchors (schema, RLS policies, page map, file conventions).
3. Read `docs/DECISIONS.md` if the mission touches areas with existing ADRs. Skip if the mission is isolated.
4. Read `docs/LESSONS.md` to avoid repeating past mistakes. Pay special attention to lessons tagged with related components.

## State Transition
```json
{ "context": { "status": "completed", "docs_read": ["PLAN", "ARCHITECTURE", "DECISIONS", "LESSONS"] } }
```

## Failure Mode
- If any doc is missing → warn but continue (non-blocking).
- If `PLAN.md` is missing → **abort** — cannot proceed without mission mapping.
