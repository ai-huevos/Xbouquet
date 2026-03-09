---
description: "Phase: Activate Megaman Suits and apply domain overlays to the current mission."
phase: suit
order: 3
---
# 🎮 SUIT Phase

> **Purpose:** Load active suits and inject domain intelligence into the current workflow phase. Suits add growth-design checklists, frameworks, and quality gates.

## Inputs
- `adw_state.json` → `current_phase` (determines which overlay to apply)
- `.agents/suits/SUITS.md` → list of active/inactive suits

## Steps

1. Read `.agents/suits/SUITS.md`.
2. Parse the `## Active` section to get the list of active suit names.
3. For each active suit, read `.agents/suits/{suit_name}.md`.
4. Determine which overlay section to apply based on the calling context:
   - If called from PLAN phase → apply each suit's **`/feature` Overlay**
   - If called from BUILD phase → apply each suit's **`/adw-start` Overlay**
   - If called from TEST phase → apply each suit's **`/adw-finish` Overlay**  
5. Store the active suit names in `adw_state.json` → `suits_active`.

## State Transition
```json
{ "suit": { "status": "completed", "suits_loaded": ["growth-loops", "psychology"] } }
```

## Failure Mode
- If `SUITS.md` doesn't exist → skip silently (no suits = no overlays, vanilla ADW).
- If a suit file is missing → warn but continue with remaining suits.
