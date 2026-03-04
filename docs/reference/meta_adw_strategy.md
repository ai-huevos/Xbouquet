# Meta-Process: Agentic Development Workflows (ADWs)

*A synthesized meta-analysis derived from NotebookLM best practices compared against the Xpress Buke project's current architecture and workflow.*

## 1. Foundational Setup & Architecture

### NotebookLM Insights
- **The Execution Trade-Off:** ADWs balance *agency* (autonomy) against *reliability* (trust).
- **Control Flow:** Advanced ADWs use a "Decouple Planning from Execution" approach to prevent infinite loops and burned tokens. Planning must be deterministically validated before passing to an execution engine.
- **Multi-Agent Systems:** Scaling workflows requires moving from monoliths to a Supervisor Architecture (e.g., a "Researcher" handing off to a "Coder").

### Our Current Application (Xpress Buke)
- **Status: EXCELLENT ALIGNMENT.**
- We natively decouple planning from execution via our **Hybrid Model** (Claude plan-first → Antigravity execution). 
- `CLAUDE.md` and `docs/ARCHITECTURE.md` act as our rigid, deterministic boundaries that constrain the agent execution. 
- We don't rely on endless open loops; we use explicit, discrete vertical slices mapped in `docs/PLAN.md` and `MVP_MISSIONS.md`.

---

## 2. Multi-Granular Testing & Browser ADWs

### NotebookLM Insights
Agent testing cannot simply check the final output. It requires **Multi-Granular Evaluation**:
1. **Level 1 (End-to-End):** Did it accomplish the task? (Often evaluated by `LLM-as-a-judge` or checking database state).
2. **Level 2 (Single Step):** Did it select the correct tool and arguments?
3. **Level 3 (Trajectory):** Was the logic path efficient, or did it waste API calls?

**Browser Testing for ADWs:**
- Test against *Deterministic Sandbox Environments* (local staging), never live dynamic websites, to prevent agent hallucinations.
- Evaluate step 2 by parsing the DOM accurately.
- Validate end-to-end success using headless browser assertions (e.g., Playwright) that assert state changes, rather than relying on LLM intuition.

### How We Adapt This
- **Action Taken:** We have integrated `npx playwright test` and visual testing via the `browser_subagent` directly into our `/adw-finish` workflow. Every time a mission finishes, the agent uses the subagent to interact with the DOM and generate WebP recording evidence automatically. This ensures our Level 1 (End-to-End) and Level 2 (Single Step) validation are deeply embedded in the Xpress Buke workflow.

---

## 3. Safe Deployment & Zero-Trust

### NotebookLM Insights
- **Hit-the-Brakes (HITL):** Implement an "authorize mode" right before the agent invokes any dangerous tools (e.g., executing schema migrations).
- **Pessimistic Trust Boundaries:** Sandboxing and least privilege are critical. Never grant the agent or the application broad database access if restricted RLS can suffice.
- **Shadow Deployments:** Route live traffic to newer agents without letting them return output, observing if their autonomous plans match safe, expected behavior.

### Our Current Application (Xpress Buke)
- **Status: EXCELLENT ALIGNMENT.** 
- We employ strict **Review-Driven Mode** (never auto-accept) which acts as the Human-In-The-Loop authorization.
- We strictly enforce **Supabase Row Level Security (RLS)** *before* public launch as detailed in Mission 5 of our ADW setup.

---

## 4. Hassle-Free Maintenance (FMOps)

### NotebookLM Insights
- **Prompt Catalogs:** Treat prompts as code. Keep instructions out of the main logic to allow iteration without total software redeployment.
- **Stateful Checkpointing:** Save the execution DAG state so an error doesn't require restarting the entire mission from scratch.
- **Reflexion:** Teach the agent to self-correct by feeding linter errors and compilation failures back into the prompt automatically.

### How We Adapt This
- **What We Did Right:** We just moved our meta-instructions ("Prompt Catalogs") out of the messy `gpt instructions.md` files and directly into `CLAUDE.md` and dedicated markdown artifacts (`MVP_MISSIONS.md`). This enables hassle-free iteration on the agent's behavior without touching the next.js source code.
- **Next Step for Us:** Ensure our `/adw-finish` workflow strictly runs full type-checks (`tsc --noEmit`) and linting, forcing "Reflexion" on the agent before the human reviews the PR.

---

## 🚀 Conclusion & Next Steps

Our newly reconstructed ADW folder structure (`docs/PLAN.md`, `CLAUDE.md`, `.agents/workflows/adw-*`) is already performing at an enterprise-grade tier according to AI engineering literature. Building upon this without hassle means:

1. **Keep Prompts as Markdown:** Do not hardcode instructions into scripts. Keep adjusting the `MVP_MISSIONS.md` files dynamically.
2. **Add Playwright to ADW:** As we begin executing the Supplier CRUD (Mission 2), we should integrate basic headless browser tests as the deterministic "judge" of our ADW performance.
