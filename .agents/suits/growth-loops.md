---
name: Growth Loops
emoji: 🎯
domain: Growth loop architecture, viral coefficient, AARRR funnel
source: growth-product-design-repo/Growth Product Design Prompt §2, framework-overview/implementation-roadmap.md
---
# 🎯 Growth Loops Suit

> **Philosophy:** Every feature either powers a growth loop or is waste. Map the loop before writing the code.

---

## `/feature` Overlay

When planning a feature with this suit active, **add the following to the implementation plan:**

### Growth Loop Mapping (Required)

1. **Which loop does this feature power?** Identify one:
   - **Acquisition Loop:** Trigger → Landing → Value Preview → Signup → Immediate Value → Share → Trigger
   - **Engagement Loop:** Daily Trigger → Quick Win → Progress Shown → Social Comparison → Next Challenge → Trigger
   - **Monetization Loop:** Value Realized → Limit Reached → Premium Preview → Social Proof → Time-Limited Offer → Purchase → Expanded Value
   - **Retention Loop:** Investment → Stored Value → Re-engagement Trigger → Return Visit → More Investment

2. **Loop Metrics** (fill in for the feature):
   - **Cycle Time:** How long for one complete loop iteration?
   - **Amplification Factor:** How many additional users or actions does one cycle generate?
   - **Target Viral Coefficient (K):** Is K > 1.0 achievable?

3. **AARRR Position:** Where does this feature sit?
   - [ ] Acquisition — brings new users in
   - [ ] Activation — delivers the "aha" moment
   - [ ] Retention — brings users back
   - [ ] Revenue — generates or expands revenue
   - [ ] Referral — causes users to invite others

---

## `/adw-start` Overlay

Before writing code with this suit active, the agent must:

1. **State the loop:** "This feature powers the [X] loop by [mechanism]."
2. **Identify the metric:** What single metric will prove this feature accelerates the loop?
3. **Consider loop intersection:** Does this feature connect two loops? (e.g., a referral feature that also serves retention)

---

## `/adw-finish` Overlay

During verification with this suit active, add to the walkthrough:

### Growth Loop Compliance Check
- [ ] **Loop identified:** The feature clearly serves a named growth loop
- [ ] **Metric defined:** A measurable KPI is identified for loop health
- [ ] **Cycle time estimated:** We can estimate how long one loop takes
- [ ] **No dead ends:** The feature doesn't create user flows that terminate without connecting back to a loop
