---
description: Generates development velocity metrics and insights from adw_state.json session history.
---
# /adw-metrics

When the USER invokes `/adw-metrics`, execute the following protocol:

> **Purpose:** Analyze past ADW sessions to surface velocity trends, bottleneck phases, retry rates, and suit effectiveness. Uses the `adw_state.json` archive as the data source.

## Data Collection

1. Scan the project for `adw_state.json` files:
   - Current: `./adw_state.json`
   - Archive: `.agents/history/` (completed sessions moved here after SHIP)

2. If no archive directory exists, create `.agents/history/` and note that metrics will improve after multiple sessions.

## Metrics Computation

3. For each completed session, extract:

   | Metric | Source | Formula |
   |--------|--------|---------|
   | **Session Duration** | `started_at` → `ship.completed_at` | End - Start |
   | **Phase Duration** | Each `phases.{phase}.duration_s` | Direct |
   | **Bottleneck Phase** | Phase with max duration | `max(phases.*.duration_s)` |
   | **Retry Rate** | `phases.test.retries` | `retries / total_sessions` |
   | **First-Pass Rate** | Sessions where `test.retries == 0` | `no_retry_sessions / total` |
   | **Files Per Session** | `phases.build.files_changed` | Average across sessions |
   | **Suit Compliance** | `suit_compliance.{suit}.*` | % of gates passed |
   | **Mission Type Mix** | `type` field | Count per type (feature/bugfix/parallel) |

## Report Generation

4. Generate a `metrics_report.md` artifact with:

   ### Velocity Dashboard
   ```
   ┌─────────────────────────────────────────────┐
   │  ADW Velocity Dashboard — {date_range}      │
   ├─────────────────────────────────────────────┤
   │  Total Sessions:     {count}                │
   │  Avg Duration:       {minutes}m             │
   │  First-Pass Rate:    {pct}%                 │
   │  Most Common Type:   {type}                 │
   │  Slowest Phase:      {phase} ({avg}m)       │
   │  Fastest Phase:      {phase} ({avg}m)       │
   └─────────────────────────────────────────────┘
   ```

   ### Phase Breakdown
   - Time-per-phase stacked bar (CONTEXT | SUIT | BUILD | TEST | REVIEW | LEARN | SHIP)
   - Identify phases consuming >40% of total time

   ### Retry Analysis
   - Which errors trigger retries most often
   - Average time spent in retry loops
   - Recommendations to reduce retry rate

   ### Suit Effectiveness
   - Which suit gates fail most often
   - Correlation between active suits and session duration
   - Recommendations for default suit configuration

   ### Trends
   - Session duration over time (improving or degrading?)
   - Files changed per session over time
   - Lessons captured per session

## Actionable Insights

5. Based on the data, generate specific recommendations:
   - If BUILD >50% of time → suggest splitting into smaller missions
   - If TEST retries >30% → suggest adding tsc checks during BUILD
   - If LEARN captures <1 lesson per 5 sessions → increase auto-detection sensitivity
   - If certain suits always fail → suggest updating the suit or deactivating

## Archive Management

6. After SHIP phase completes in any session, the `/adw-finish` workflow should:
   ```bash
   # Move completed state to archive
   mv adw_state.json .agents/history/adw_state_{mission_id}_{timestamp}.json
   ```

## Example Output

```
/adw-metrics

📊 ADW Velocity Dashboard (Last 10 Sessions)
─────────────────────────────────────
Total Sessions:    10
Avg Duration:      47m
First-Pass Rate:   70%
Slowest Phase:     BUILD (avg 22m, 47% of total)
Fastest Phase:     CONTEXT (avg 0.5m)
Retry Rate:        30% (mostly tsc errors in M28-M30)

💡 Recommendations:
1. BUILD is your bottleneck — consider breaking M33+ into smaller slices
2. 3/10 retries were tsc errors — add incremental tsc check during BUILD
3. growth-loops suit passes 90%, psychology fails 40% — review psychology checklist
```
