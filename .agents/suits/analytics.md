---
name: Growth Analytics
emoji: 📊
domain: North Star metrics, cohort analysis, funnel optimization, growth accounting
source: growth-product-design-repo/templates/research-prompts/growth-analytics-prompt.md, growth-optimized-prd-template.md §5
---
# 📊 Growth Analytics Suit

> **Philosophy:** If you can't measure it, you can't improve it. Every feature ships with its own scoreboard.

---

## `/feature` Overlay

When planning a feature with this suit active, **add the following to the implementation plan:**

### Metrics Requirements (Required)

1. **North Star contribution:** How does this feature move the product's North Star Metric?
   - North Star Metric for Xpress Buke: **Completed B2B Orders per Week**

2. **Leading Indicators** (pick the most relevant 2-3):
   - [ ] Activation Rate (% of users who reach "aha" moment)
   - [ ] D1/D7/D30 Retention
   - [ ] Viral Coefficient (K-factor)
   - [ ] LTV:CAC Ratio
   - [ ] Network Density (connections per user)
   - [ ] Time to Value (seconds from landing to first meaningful action)
   - [ ] Feature adoption rate

3. **Loop Health Metrics** (if feature powers a growth loop):
   - Loop Cycle Time: _target_
   - Loop Participation Rate: _target %_
   - Loop Amplification Factor: _target_

### Data Collection Plan

For each metric, specify:
- **What to track:** The specific event or data point
- **Where to track it:** Client-side event? Server action log? Database query?
- **Baseline:** What is the current value before this feature ships?

---

## `/adw-start` Overlay

Before building with this suit active, the agent must:

1. **Declare the metrics:** "This feature will be measured by [metric 1] and [metric 2]"
2. **Plan the instrumentation:** Where will tracking events be fired? (Server Actions, client events, DB triggers)
3. **Set the baseline:** What is the current state before the feature?

---

## `/adw-finish` Overlay

During verification with this suit active, add to the walkthrough:

### Analytics Compliance Check
- [ ] **Metric identified:** The feature has at least one measurable KPI
- [ ] **North Star connection:** Clear line from feature metric to North Star
- [ ] **Instrumentation present:** Tracking code or DB query exists (or is planned with specific location)
- [ ] **Baseline documented:** We know the before-state to compare against
