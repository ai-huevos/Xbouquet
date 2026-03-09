---
description: Audits past autonomous ADW sessions — reviews confidence scores, ships, and flags concerns.
---
# /adw-audit

When the USER invokes `/adw-audit [session_id|all]`, execute the following protocol:

> **Purpose:** Human audit tool for Stage 3 autonomous sessions. Review what the agent built and shipped without human oversight.

## Session Audit

1. Read `.agents/history/adw_state_{session_id}.json`
2. Present a structured audit report:

   ```
   ┌────────────────────────────────────────────┐
   │  ADW Audit Report — {mission_title}        │
   ├────────────────────────────────────────────┤
   │  Type:           {autonomous|feature}      │
   │  Confidence:     {score}/10                │
   │  Auto-shipped:   {yes|no}                  │
   │  Duration:       {minutes}m                │
   │  Files Changed:  {count}                   │
   │  Retries:        {count}                   │
   │  Suit Compliance: {pass_rate}%             │
   └────────────────────────────────────────────┘
   ```

3. For each auto-shipped session, show:
   - Confidence breakdown (all 5 factors)
   - Any override rules that were triggered
   - Git diff summary of what was changed
   - Suit compliance details

## Bulk Audit

4. If `all` is specified, generate a summary table:

   | Session | Mission | Confidence | Auto-shipped | Duration | Flags |
   |---------|---------|-----------|-------------|----------|-------|
   | Each session row... |

5. Flag sessions with:
   - `⚠️` if confidence was 5-7 (borderline)
   - `🔴` if any override was applied
   - `✅` if clean auto-ship (≥8, no overrides)

## Rollback Support

6. If the user identifies a problematic session:
   - Show the exact git commits from that session
   - Offer: `git revert {commit_sha}` to undo
   - Offer: `/adw-bugfix {issue}` to fix forward
