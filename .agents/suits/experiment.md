---
name: Experiment Design
emoji: 🔬
domain: A/B testing, hypothesis design, statistical rigor, guardrail metrics
source: growth-product-design-repo/templates/experiment-designs/growth-experiment-template.md
---
# 🔬 Experiment Design Suit

> **Philosophy:** "Speed comes from stillness." Pausing to design a hypothesis correctly accelerates everything downstream. Ship experiments, not guesses.

---

## `/feature` Overlay

When planning a feature with this suit active, **add the following to the implementation plan:**

### Experiment Hypothesis (Required)

Fill in the template:

> **If** we [specific change], **then** [specific metric] will [increase/decrease] by [specific amount] **because** [reasoning grounded in psychology, data, or network effects].

### Success Criteria

| Tier | Threshold | What Happens |
|------|-----------|--------------|
| **Minimum Viable Success** | [X% improvement in metric] | Keep the feature, iterate |
| **Target Success** | [Y% improvement] | Ship widely, build on it |
| **Exceptional Success** | [Z% improvement] | Double down, expand scope |
| **Failure Threshold** | [Below W%] | Roll back, analyze learnings |

### Guardrail Metrics

Things that **must not break** when we ship this feature:
- [ ] Page load time stays under Xms
- [ ] Existing conversion rate doesn't drop by more than Y%
- [ ] No increase in error rate
- [ ] _[Feature-specific guardrail]_

### Test Design (if A/B testing)

- **Control:** Current experience (what users see today)
- **Variant:** New experience (what we're testing)
- **Sample allocation:** [X% control / Y% variant]
- **Duration:** [Minimum N days or N conversions]

---

## `/adw-start` Overlay

Before building with this suit active, the agent must:

1. **State the hypothesis:** One sentence in "If/Then/Because" format
2. **Define the kill switch:** At what point do we roll this back?
3. **Plan the control:** What stays the same for comparison?

---

## `/adw-finish` Overlay

During verification with this suit active, add to the walkthrough:

### Experiment Readiness Check
- [ ] **Hypothesis documented:** Clear "If/Then/Because" statement exists
- [ ] **Success tiers defined:** We know what good/great/bad looks like
- [ ] **Guardrails set:** Critical metrics are protected with thresholds
- [ ] **Rollback plan exists:** We know how to undo this change if it fails
- [ ] **Learning capture:** Even in failure, what will we learn?
