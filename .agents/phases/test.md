---
description: "Phase: Run all verification gates — type checking, linting, browser testing, and suit quality gates."
phase: test
order: 5
---
# 🧪 TEST Phase

> **Purpose:** Verify the build meets quality standards. This is the **auto-retry gate** — if tests fail, the agent should attempt to fix and re-test before asking a human.

## Inputs
- `adw_state.json` → `suits_active`, `phases.test.retries`
- BUILD phase output (implemented code)
- SUIT phase output (active overlays for `/adw-finish`)

## Steps

### Gate 1: Static Analysis (// turbo)
1. Run `npx tsc --noEmit` — strict TypeScript compliance.
2. Run `npx eslint .` — linting compliance.

### Gate 2: Build Verification (// turbo)
3. Run `npx next build` — catches import errors and SSR issues TSC misses.

### Gate 3: Visual Verification
4. Use `browser_subagent` to test the built feature flow as a human would.
5. The browser subagent automatically generates a WebP video recording.

### Gate 4: Suit Quality Gates
6. For each active suit, run its **`/adw-finish` Overlay** checklist:
   - Growth Loops: loop identified? metric defined? no dead ends?
   - Psychology: trigger present? reward present? ethical check?
   - Octalysis: ≥2 core drives? White Hat present? progression visible?
   - Network Effects: value increases with users? cold start addressed?
   - Analytics: metric identified? North Star connection? instrumentation?
   - Experiment: hypothesis documented? success tiers? guardrails?
7. Record suit compliance in `adw_state.json` → `suit_compliance`.

## State Transition (Pass)
```json
{ "test": { "status": "completed", "gates_passed": ["tsc", "eslint", "build", "browser", "suits"], "retries": 0 } }
```

## Auto-Retry Logic (max 2 retries)
```
IF any gate fails AND retries < 2:
  1. Record error in adw_state.json → phases.test.last_error
  2. Increment retries
  3. Return to BUILD phase with specific error context
  4. Re-run TEST phase

IF retries >= 2:
  1. Record final error
  2. Notify user with error details
  3. Wait for human intervention
```

## Failure Mode
- tsc/eslint failures → auto-fix attempt (return to BUILD)
- `next build` failures → auto-fix attempt (return to BUILD)
- Browser test failures → document the issue, notify user (likely UX decision needed)
- Suit gate failures → document in walkthrough, do NOT block (advisory, not blocking)
