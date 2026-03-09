---
description: "Phase: Capture lessons learned and auto-detect patterns from the session's changes."
phase: learn
order: 7
---
# 📝 LEARN Phase

> **Purpose:** Extract knowledge from this session. Capture lessons both manually and automatically by analyzing the session's code changes.

## Inputs
- `adw_state.json` → `phases` (duration, retries, errors)
- Git diff of session changes

## Steps

### Manual Capture
1. If significant bugs or architectural learnings were encountered during BUILD or TEST, append a new section to `docs/LESSONS.md` with:
   - **What happened** (the problem)
   - **Why it happened** (the root cause)
   - **How to avoid it** (the pattern to remember)

### Auto-Lesson Detection
2. Analyze the session's git diff:
   - **If any file was changed >2 times** → suggests debugging occurred. Auto-suggest a lesson about the debugging pattern.
   - **If a migration was added** → check that matching RLS policies exist. If missing, flag it.
   - **If `adw_state.json.phases.test.retries > 0`** → document what caused the retry and how it was fixed.
   - **If browser_subagent found visual bugs** → document the UI pattern that caused the issue.

3. Format auto-detected lessons as suggestions. The agent should write them to `LESSONS.md` if they are substantial, or skip if trivial.

## State Transition
```json
{ "learn": { "status": "completed", "lessons_added": 1, "auto_detected": ["file_edited_3x: src/app/dashboard/page.tsx"] } }
```

## Failure Mode
- This phase never blocks. If lesson detection fails, log the error and continue to SHIP.
