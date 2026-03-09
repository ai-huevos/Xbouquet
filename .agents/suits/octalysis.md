---
name: Octalysis Gamification
emoji: 🎮
domain: Yu-kai Chou's 8 Core Drives, player types, progression systems
source: growth-product-design-repo/templates/research-prompts/octalysis-gamification-prompt.md, growth-optimized-prd-template.md §3.2
---
# 🎮 Octalysis Gamification Suit

> **Philosophy:** Gamification is not points and badges bolted on. It's understanding what *drives* human behavior and designing systems that align with those drives.

---

## `/feature` Overlay

When planning a feature with this suit active, **add the following to the implementation plan:**

### Core Drive Mapping (Required — score at least 2)

Rate each drive's relevance (0 = none, 1 = minor, 2 = primary) for this feature:

| # | Core Drive | Relevance | Implementation |
|---|-----------|-----------|----------------|
| 1 | **Epic Meaning & Calling** — Being part of something bigger | 0/1/2 | _How?_ |
| 2 | **Development & Accomplishment** — Progress, mastery, challenge | 0/1/2 | _How?_ |
| 3 | **Empowerment & Creativity** — Creative expression, feedback | 0/1/2 | _How?_ |
| 4 | **Ownership & Possession** — Collecting, customizing, controlling | 0/1/2 | _How?_ |
| 5 | **Social Influence & Relatedness** — Social pressure, mentorship, competition | 0/1/2 | _How?_ |
| 6 | **Scarcity & Impatience** — Limited access, time pressure, exclusivity | 0/1/2 | _How?_ |
| 7 | **Unpredictability & Curiosity** — Surprise, random rewards, exploration | 0/1/2 | _How?_ |
| 8 | **Loss & Avoidance** — Fear of losing progress, FOMO, sunk cost | 0/1/2 | _How?_ |

**White Hat vs Black Hat Balance:**
- Drives 1-3 are **White Hat** (positive, empowering, long-term) ← Aim for these
- Drives 6-8 are **Black Hat** (urgent, addictive, short-term) ← Use sparingly, ethically

### Target Player Types

Which player types does this feature serve?
- [ ] **Achievers** — Want to complete things, earn status, demonstrate mastery
- [ ] **Explorers** — Want to discover, understand, find hidden things
- [ ] **Socializers** — Want to connect, help, share, belong
- [ ] **Killers/Competitors** — Want to win, rank, outperform others

---

## `/adw-start` Overlay

Before building with this suit active, the agent must:

1. **Declare the primary drive:** "This feature is powered by Core Drive #X"
2. **Choose White vs Black Hat:** Prefer White Hat drives for long-term engagement. If using Black Hat drives (Scarcity, Loss Avoidance), ensure a White Hat drive is also present as a counterbalance.
3. **Design the progression signal:** How does the user see their progress? (bar, counter, level, badge, status)

---

## `/adw-finish` Overlay

During verification with this suit active, add to the walkthrough:

### Core Drive Audit
- [ ] **Minimum 2 drives scored:** Feature maps to at least 2 Core Drives with concrete implementation
- [ ] **White Hat presence:** At least one White Hat drive (1-3) is present
- [ ] **Progression visible:** The user can see their progress or growth
- [ ] **No manipulative patterns:** Black Hat drives are balanced with positive user outcomes
