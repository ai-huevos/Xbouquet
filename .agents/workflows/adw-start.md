---
description: Starts an Agentic Development Workflow (ADW) session for a specific mission.
---
# /adw-start

When the USER invokes `/adw-start [mission_description_or_number]`, execute the following protocol strictly:

1. **Context Initialization**:
   - Immediately read `docs/PLAN.md` and `docs/MVP_MISSIONS.md` (or `docs/GROWTH_MISSIONS.md`) to map the requested mission.
   - Read the explicit implementation plan from `docs/missions/mission-[number]-*-plan.md` if it exists.
   - Read `docs/ARCHITECTURE.md` (and `docs/DECISIONS.md` if necessary) to establish technical anchors.

2. **Branch Management** (// turbo):
   - Run `git fetch`
   - Run `git checkout dev`
   - Run `git pull origin dev` (or just ensure we are up to date on the dev branch).

3. **Execution**:
   - Call `task_boundary` to enter EXECUTION mode.
   - Begin implementing the specific feature slice mapped to this mission.
   - If UI components are needed, use the Stitch MCP tools (`mcp_StitchMCP_generate_screen_from_text` etc) to iteratively create polished UI that matches the brand requirements.
   - Write database migrations, Server Actions, and Next.js interface components.

4. **Commit Phase** (// turbo):
   - Run `git add .`
   - Run `git commit -m "feat: [ADW Mission] automated implementation"`

5. **Review Phase**:
   - Pause execution and call `notify_user` to present the completed work.
   - Provide a clear summary of what was built, how it meets the "Done Criteria", and how the user can test it locally.
   - Wait for explicit user validation before proceeding to the next steps.
