---
description: Plans a new feature and generates an implementation plan, preparing for an ADW session.
---
# /feature

When the USER invokes `/feature [feature_description]`, execute the following protocol strictly:

1. **Context Initialization**:
   - Briefly read relevant existing documentation (e.g., `docs/PLAN.md`, `docs/ARCHITECTURE.md`, or `docs/DECISIONS.md`) to align the new feature with the current architectural paradigms and project state.
   - Search the codebase to understand where this feature will live and what existing components/services can be reused.

2. **Planning Phase**:
   - Call `task_boundary` to enter **PLANNING** mode.
   - Breakdown the requested feature into specific, actionable steps.
   - Draft a comprehensive design covering:
     - UI/UX components (referencing Stitch MCP patterns if applicable).
     - Database schema extensions and RLS policies.
     - Server Actions and backend logic.
     - Required route changes or new pages in Next.js.

3. **Artifact Generation**:
   - Generate or update the `implementation_plan.md` artifact with the detailed design and step-by-step execution strategy.
   - If appropriate, update `task.md` with the new tasks for the feature.
   - **CRITICAL**: To ensure the handoff to `/adw-start` is smooth, you MUST append the newly planned feature as a numbered mission under the appropriate Wave in `docs/PLAN.md` (e.g., `Mission X: Feature Name`).

4. **Review Phase**:
   - Pause your work and call `notify_user` to present the `implementation_plan.md` to the user for review.
   - Ask the user to confirm the plan or provide feedback.
   - Explicitly inform the user: *"Once you approve this plan, you can run `/adw-start` (or your preferred start command) to begin the implementation phase."*
