---
name: Network Effects
emoji: 🌐
domain: Viral mechanics, platform economics, two-sided markets, cold start strategies
source: growth-product-design-repo/templates/research-prompts/network-effects-prompt.md, Growth Product Design Prompt §3
---
# 🌐 Network Effects Suit

> **Philosophy:** A feature that doesn't increase value for other users is a utility. A feature that does is a network effect. Build network effects, not utilities.

---

## `/feature` Overlay

When planning a feature with this suit active, **add the following to the implementation plan:**

### Network Effects Map (Required)

Analyze which types of network effects this feature creates:

| Type | Question | Answer |
|------|----------|--------|
| **Direct** | Does each additional user make the product more valuable for existing users? | _How?_ |
| **Indirect** | Does usage create an ecosystem that attracts complementary users? | _How?_ |
| **Data** | Does collective usage generate intelligence that improves the product for everyone? | _How?_ |
| **Social** | Does usage create community bonds or social capital? | _How?_ |

### Cold Start Analysis

How does this feature work at different scales?
- **0 users:** Does this feature provide value to the very first user? (If not, what's the bootstrap?)
- **10 users:** Does the feature start to show network benefits?
- **100 users:** Is there a qualitative change in experience?
- **1,000+ users:** What new behaviors emerge?

### Two-Sided Market Impact (for marketplace features)

- **Supply side (Suppliers):** How does this feature attract or retain suppliers?
- **Demand side (Shops):** How does this feature attract or retain shops?
- **Cross-side effect:** Does adding suppliers benefit shops, and vice versa?

---

## `/adw-start` Overlay

Before building with this suit active, the agent must:

1. **Declare the network type:** "This feature creates [Direct/Indirect/Data/Social] network effects"
2. **Define critical mass:** What threshold of users/actions makes this feature self-sustaining?
3. **Design the invite surface:** Is there a natural moment where the user would want to bring others in?

---

## `/adw-finish` Overlay

During verification with this suit active, add to the walkthrough:

### Network Effects Compliance Check
- [ ] **Value increases with users:** More users = better experience (not just more data)
- [ ] **Cold start addressed:** The feature provides standalone value even with few users
- [ ] **Switching cost created:** Usage builds user-specific value that's hard to replicate elsewhere
- [ ] **No value ceiling:** Network benefits continue to grow (don't plateau at N users)
