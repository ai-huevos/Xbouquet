---
description: Plans a new feature and generates an implementation plan, preparing for an ADW session.
---
# /feature

When the USER invokes `/feature [feature_description]`, execute the following protocol strictly:

1. **Context Initialization**:
   - Read `docs/PLAN.md`, `docs/ARCHITECTURE.md`, and `docs/DECISIONS.md` to align with current project state.
   - Search the codebase to understand where this feature will live and what can be reused.

2. **Planning Phase**:
   - Call `task_boundary` to enter **PLANNING** mode.
   - Break down the feature into specific, actionable steps.
   - Draft a comprehensive design covering:
     - UI/UX components needed.
     - Database schema extensions and RLS policies (if any).
     - Server Actions and backend logic.
     - Route changes or new pages.

3. **Artifact Generation**:
   - Generate the implementation plan as an `implementation_plan.md` in your brain artifacts directory.
   - **CRITICAL**: Append the feature as a new numbered mission under the appropriate Wave in `docs/PLAN.md`.

4. **Review Phase**:
   - Call `notify_user` to present the implementation plan for review.
   - Explicitly inform the user: *"Once you approve this plan, you can run `/adw-start` to begin implementation."*
