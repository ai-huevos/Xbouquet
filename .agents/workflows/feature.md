---
description: Plans a new feature using CONTEXT + PLAN + SUIT phases, then generates an implementation plan for review.
---
# /feature

When the USER invokes `/feature [feature_description]`, execute the following protocol:

> **This is a phase orchestrator** for the planning-only lifecycle. It calls CONTEXT → PLAN → SUIT phases but does NOT build.

## Phase Execution

1. **Execute phase:** `.agents/phases/context.md`
   - Read project docs to align with current project state.
   - Search the codebase to understand where this feature will live and what can be reused.

2. **Execute phase:** `.agents/phases/plan.md`
   - Break down the feature into specific, actionable steps.
   - Draft a comprehensive design covering UI, schema, backend, and routes.

3. **Execute phase:** `.agents/phases/suit.md` (apply `/feature` overlays)
   - For each active suit, apply its **`/feature` Overlay** to the implementation plan:
     - Growth loop mapping, cognitive bias stack, core drive analysis, network effects map, metrics requirements, experiment hypothesis, etc.

## Artifact Generation

4. Generate the implementation plan as an `implementation_plan.md` in your brain artifacts directory.
5. **CRITICAL**: Append the feature as a new numbered mission under the appropriate Wave in `docs/PLAN.md`.

## Human Gate

6. Call `notify_user` to present the implementation plan for review.
   - Explicitly inform the user: *"Once you approve this plan, run `/adw-start` to begin implementation."*
