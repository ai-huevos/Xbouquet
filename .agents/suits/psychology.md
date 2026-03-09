---
name: Behavioral Psychology
emoji: 🧠
domain: Cognitive biases, habit formation, emotional design, Cialdini's principles
source: growth-product-design-repo/templates/research-prompts/behavioral-psychology-prompt.md, Growth Product Design Prompt §3-4
---
# 🧠 Behavioral Psychology Suit

> **Philosophy:** "Emergence over force." Design conditions for desired behavior to emerge — don't manipulate, facilitate. The best triggers feel invisible.

---

## `/feature` Overlay

When planning a feature with this suit active, **add the following to the implementation plan:**

### Cognitive Bias Stack (Required)

Map which of Cialdini's principles this feature leverages (check at least 2):

| Principle | How This Feature Applies It | Trigger Point |
|-----------|----------------------------|---------------|
| **Reciprocity** | What value do we give first before asking? | Onboarding / First touch |
| **Commitment/Consistency** | What small ask leads to bigger engagement? | Progressive disclosure |
| **Social Proof** | What success of others is made visible? | Browse / Decision point |
| **Authority** | What credibility markers are shown? | Trust barriers |
| **Liking** | What creates affinity with the brand? | Visual design / Tone |
| **Scarcity** | What time/quantity/access limitation exists? | Purchase / Action point |
| **Unity** | What shared identity or belonging is created? | Community / Profile |

### Habit Formation Timeline

If this feature touches a repeating user action, map it to the timeline:
- **Day 1-3:** Trigger → Action → Reward calibration (what's the first reward?)
- **Day 4-7:** Variable reward introduction (what surprise element exists?)
- **Day 8-21:** Investment accumulation (what does the user build that increases switching cost?)
- **Day 22+:** Habit automation (what becomes automatic behavior?)

### Emotional Journey Map

For UX features, sketch the emotional arc:
1. **Entry emotion:** What does the user feel when they arrive?
2. **Friction point:** Where might they feel frustrated or confused?
3. **Peak moment:** Where is the dopamine hit?
4. **Exit emotion:** What do they feel when they leave?

---

## `/adw-start` Overlay

Before writing UI code with this suit active, the agent must:

1. **Identify the internal trigger:** What emotion or situation prompts this feature's use? (boredom? anxiety? FOMO? need?)
2. **Design the reward type:** Is it a Tribe reward (social), Hunt reward (resources), or Self reward (mastery)?
3. **Place the investment:** What does the user put in (data, content, effort, reputation) that makes them more likely to return?

---

## `/adw-finish` Overlay

During verification with this suit active, add to the walkthrough:

### Behavioral Trigger Compliance Check
- [ ] **Trigger identified:** The feature has a clear internal or external trigger
- [ ] **Reward present:** Using the feature produces a satisfying outcome
- [ ] **Investment created:** The user leaves something behind that increases switching cost
- [ ] **Ethical check:** The feature facilitates, not manipulates — the user is better off for having used it
- [ ] **Variable element:** There is at least one unpredictable/delightful element (not everything is the same every time)
