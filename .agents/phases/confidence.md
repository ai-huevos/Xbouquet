---
description: "Phase: Compute confidence score to decide auto-ship vs human review."
phase: confidence
order: 5.5
---
# 🎯 CONFIDENCE Phase

> **Purpose:** Replace the human REVIEW gate with a scored assessment. This is what makes Stage 3 autonomous — only low-confidence missions pause for human review.

## Inputs
- `adw_state.json` → all phase results
- TEST phase output (gates passed, retries)
- Git diff stats (files changed, migrations)
- SUIT phase output (compliance results)

## Scoring Algorithm

Compute weighted score (1-10):

```
score = (
  test_gate_score     * 0.30 +
  file_change_score   * 0.20 +
  retry_score         * 0.20 +
  schema_score        * 0.15 +
  suit_score          * 0.15
)
```

### Factor Calculations

| Factor | 10 | 7 | 5 | 3 |
|--------|-----|-----|-----|-----|
| Test gates | All 4 pass | 3 pass | 2 pass | ≤1 pass |
| Files changed | <10 | 10-15 | 16-25 | >25 |
| Retries | 0 | — | 1 | 2 |
| Schema changes | None | — | Non-RLS migration | RLS/security migration |
| Suit compliance | All pass | 1 advisory fail | 2+ advisory fails | Blocking fail |

### Override Rules (force low score)

These always force `score ≤ 4` regardless of calculated score:
- Database migration detected
- RLS policy changes
- `.env` or secret changes
- Changes to `.agents/` files (meta-changes)
- `>30` files changed

## Decision

```
IF score ≥ 8  → proceed to SHIP (auto-ship)
IF score 5-7  → proceed to REVIEW (human gate)
IF score < 5  → STOP, generate error report, notify user
```

## State Transition
```json
{
  "confidence": {
    "status": "completed",
    "score": 9,
    "decision": "auto_ship",
    "breakdown": {
      "test_gates": 10, "files_changed": 8,
      "retries": 10, "schema_changes": 10,
      "suit_compliance": 8
    },
    "overrides_applied": []
  }
}
```
