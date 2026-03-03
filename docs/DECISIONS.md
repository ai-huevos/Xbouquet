# Xpress Buke — Architectural Decision Log

> Every significant decision, timestamped. New entries go at the bottom.

---

## ADR-001: Growth Systems as Modular Overlays
**Date:** 2026-03-02
**Status:** Accepted
**Context:** The marketplace needs gamification (drops, tiers, badges, referrals) but the core transactional flow (browse → cart → checkout → fulfill) must remain stable and simple.
**Decision:** Growth systems are modular overlays that derive from core data but never modify core table schemas. They read from `orders`, `flower_products`, `profiles` but only write to their own tables.
**Exception:** Drop claims inject into the cart at checkout — this is additive (post-order-creation hook on `drop_claims`), not a modification of the order creation logic.
**Consequences:** Core flow can be developed and tested independently. Growth systems can be deployed/rolled back without risk to order processing.

---

## ADR-002: Tier Scoring — Batch, Not Real-Time
**Date:** 2026-03-02
**Status:** Accepted
**Context:** Tiers could be recalculated on every order (real-time) or in batches (eventual).
**Decision:** Daily batch recalculation at 02:00 UTC. Incremental aggregation using running totals with delta from `last_calculated_at`. Tier can only drop by 1 level per cycle (grace period).
**Rationale:** Real-time would require triggers on `orders` and `order_items` — touching core tables with growth logic. Batch keeps the systems decoupled and is cheaper computationally.
**Consequences:** A new order doesn't instantly change a user's tier. Acceptable for a marketplace where tier benefits (drop access, search ranking) don't need sub-day precision.

---

## ADR-003: Drop Reservation Model — Separate Inventory
**Date:** 2026-03-02
**Status:** Accepted
**Context:** Drop items reference existing `flower_products`. Need to prevent regular orders from depleting inventory allocated to drops.
**Decision:** When a drop is published, `drop_qty` is decremented from `flower_products.stock_qty`, effectively "locking" that inventory. If the drop is cancelled, stock is restored. Drop claims use `SELECT FOR UPDATE` for atomic `claimed_qty` increments.
**Consequences:** Regular browsing shows reduced stock (accurate). Drop claims can't oversell. Cancellation cleanly restores inventory. Adds complexity to the publish/cancel flows.

---

## ADR-004: Drop Claim TTL — 30 Minutes
**Date:** 2026-03-02
**Status:** Accepted
**Context:** Shops claim drop items which creates a reservation. Need a TTL to prevent indefinite inventory locks.
**Decision:** 30-minute TTL (`drop_claims.expires_at = now() + interval '30 minutes'`). Cron job every 5 minutes expires unchecked-out reservations and restores `claimed_qty`.
**Rationale:** B2B buyers may need internal approval before checkout. 30 minutes balances urgency with practical workflow needs.

---

## ADR-005: Referral Credit — Only on Qualified (Delivered Order)
**Date:** 2026-03-02
**Status:** Accepted
**Context:** Referral systems are vulnerable to gaming (fake signups, order-and-cancel).
**Decision:** Three-stage referral lifecycle: signed_up → activated (profile complete) → qualified (first delivered order). Referrer gets credit only at `qualified` stage, and only at the next tier recalculation cycle.
**Consequences:** Slower reward loop but resistant to gaming. `UNIQUE(referred_id)` prevents multi-referral exploitation.

---

## ADR-006: Badges Are Revocable
**Date:** 2026-03-02
**Status:** Accepted
**Context:** Badges could be permanent (once earned, kept forever) or conditional (revoked if criteria no longer met).
**Decision:** Daily badge check evaluates both awards and revocations. Revoked badges are moved to `user_badges_history` for analytics. Only active badges displayed in UI.
**Rationale:** Prevents badge inflation over time. Keeps badges meaningful as trust signals. History table preserves data for analytics.

---

## ADR-007: Showcases — Immediate Publish, No Moderation Queue
**Date:** 2026-03-02
**Status:** Accepted
**Context:** Showcase images (arrangement photos) could require pre-publication moderation or publish immediately.
**Decision:** `is_published` defaults to `true`. Admin can unpublish retroactively. Future: add reporting/flagging mechanism.
**Rationale:** Reduces friction for content creation. B2B context (registered businesses) has lower abuse risk than consumer platforms.

---

## ADR-008: Tier Visibility — Public for Suppliers
**Date:** 2026-03-02
**Status:** Accepted
**Context:** Supplier tiers could be hidden (internal ranking) or visible (trust signal for shops).
**Decision:** Supplier tier displayed in catalog and directory. New suppliers (tier 0) show "New on Xpress Buke" label instead of a numeric tier.
**Rationale:** Trust signals drive conversion in B2B. The "New" label prevents negative perception of tier 0 while being transparent.

---

## ADR-009: Drop Pricing — No Constraint Relative to Regular Price
**Date:** 2026-03-02
**Status:** Accepted
**Context:** Should `drop_price` be required to be lower than `flower_products.price_per_unit`?
**Decision:** No constraint. `drop_price` can be above or below regular price.
**Rationale:** Supports both "flash deal" (discounted) and "premium limited edition" (premium) positioning. Business flexibility > artificial constraints.

---

## ADR-010: Migration Sequencing — Four Additive Phases
**Date:** 2026-03-02
**Status:** Accepted
**Context:** 20+ new tables need a safe deployment order.
**Decision:** Phase 1: Status (tiers, badges) → Phase 2: Viral (follows, referrals, showcases) → Phase 3: Scarcity (drops) → Phase 4: Trending. Each phase is independently deployable. All tables are additive — no ALTER on existing MVP tables.
**Consequences:** Can ship growth features incrementally. Rollback is table-level DROP (clean).

---

## ADR-011: No Real-Time, No Messaging, No Notifications
**Date:** 2026-03-02
**Status:** Accepted
**Context:** Growth systems could include real-time updates, push notifications, or in-app messaging.
**Decision:** Explicitly excluded from scope. All growth data is read on page load or via server action calls. No Supabase Realtime subscriptions, no push, no email triggers.
**Rationale:** Scope control. These are future-phase features. Current architecture doesn't preclude adding them later.

---

## ADR-012: Trending — Regular Table, Not Materialized View
**Date:** 2026-03-02
**Status:** Accepted
**Context:** Trending data could use Postgres materialized views or regular tables populated by batch functions.
**Decision:** Regular tables (`trending_snapshots` + `trending_entries`) populated by a weekly Edge Function/pg_cron job.
**Rationale:** Full control over timing, incremental updates, and the ability to store historical snapshots. Materialized views refresh atomically and don't support incremental or historical patterns.

---

## ADR-013: Architecture Split — Core MVP vs Growth Systems
**Date:** 2026-03-02
**Status:** Accepted
**Context:** Single ARCHITECTURE.md contained both core transactional flow and all 4 growth systems (660 lines). No application code existed yet. Risk of building growth surface area before core loop was validated.
**Decision:** Split into two documents:
- `/docs/ARCHITECTURE.md` — Core MVP only (auth, profiles, products, cart, orders). This is the active build target.
- `/docs/GROWTH_ARCHITECTURE_V2.md` — All growth systems (drops, tiers, badges, referrals, showcases, trending). Frozen until core ships and is validated with real users.
**Trigger for growth work:** 5 real suppliers, 10 real shops, 20+ real orders completed.
**First growth feature:** Drops only (directly increases order frequency). Not tiers, not badges, not referrals.
**Rationale:** Architecture without running code is speculation. The core order loop must prove itself in production before investing in engagement overlays. Cognitive separation prevents scope creep during execution.
