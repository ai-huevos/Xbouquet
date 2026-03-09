---
description: Starts an Agentic Development Workflow (ADW) session for a specific mission.
---
# /adw-start

When the USER invokes `/adw-start [mission_description_or_number]`, execute the following protocol strictly:

1. **Context Initialization**:
   - Read `docs/PLAN.md` to map the requested mission and understand its scope.
   - Read `docs/ARCHITECTURE.md` to establish technical anchors (schema, RLS, page map, file conventions).
   - Read `docs/DECISIONS.md` if the mission touches areas with existing ADRs.
   - Read `docs/LESSONS.md` to avoid repeating past mistakes.

2. **Branch Management** (// turbo):
   - Run `git fetch`
   - Run `git checkout dev`
   - Run `git pull origin dev`

3. **Execution**:
   - Call `task_boundary` to enter EXECUTION mode.
   - Begin implementing the specific feature slice mapped to this mission.
   - Write database migrations, Server Actions, and Next.js interface components.

4. **Commit Phase** (// turbo):
   - Run `git add .`
   - Run `git commit -m "feat: [ADW Mission] automated implementation"`

5. **Review Phase**:
   - Pause execution and call `notify_user` to present the completed work.
   - Provide a clear summary of what was built, how it meets the "Done Criteria", and how the user can test it locally.
   - Wait for explicit user validation before proceeding.
