/**
 * ADW CLI — Shared Types
 * 
 * Blueprint First, Model Second: These types enforce the deterministic
 * contract for the state machine. The LLM never touches these — code does.
 */

// ─── Phase Definitions ────────────────────────────────────────────────

export const PHASES = ['context', 'suit', 'build', 'test', 'confidence', 'review', 'learn', 'ship'] as const;
export type Phase = typeof PHASES[number];

export const PHASE_ORDER: Record<Phase, number> = {
    context: 0, suit: 1, build: 2, test: 3,
    confidence: 4, review: 5, learn: 6, ship: 7,
};

export type PhaseStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';

// ─── Workflow Types ───────────────────────────────────────────────────

export type WorkflowType = 'feature' | 'start' | 'finish' | 'bugfix' | 'auto';

/** Which phases each workflow type uses */
export const WORKFLOW_PHASES: Record<WorkflowType, Phase[]> = {
    feature: ['context', 'suit', 'build'],                                    // planning only
    start: ['context', 'suit', 'build'],                                    // execution
    finish: ['test', 'confidence', 'review', 'learn', 'ship'],              // verification + ship
    bugfix: ['context', 'build', 'test', 'ship'],                           // surgical
    auto: ['context', 'suit', 'build', 'test', 'confidence', 'learn', 'ship'], // full loop (review gated by confidence)
};

// ─── State Shape ──────────────────────────────────────────────────────

export interface PhaseRecord {
    status: PhaseStatus;
    started_at?: string;
    completed_at?: string;
    duration_ms?: number;
    retries?: number;
    error?: string;
}

export interface ConfidenceBreakdown {
    test_gates: number;      // 0-10
    files_changed: number;   // 0-10
    retries: number;         // 0-10
    schema_changes: number;  // 0-10
    suit_compliance: number; // 0-10
}

export interface ADWStateData {
    version: number;
    mission_id: string;
    mission_title: string;
    branch: string;
    type: WorkflowType;
    started_at: string;
    completed_at?: string;
    current_phase: Phase;
    suits_active: string[];
    phases: Record<Phase, PhaseRecord>;
    suit_compliance: Record<string, boolean>;

    // Stage 3 autonomy fields
    confidence_score?: number;
    confidence_breakdown?: ConfidenceBreakdown;
    auto_shipped?: boolean;
    auto_selected_mission?: string;
    overrides_applied?: string[];
}

// ─── Mission Types ────────────────────────────────────────────────────

export interface Mission {
    number: number;
    title: string;
    completed: boolean;
    wave: number;
    dependencies: number[];
}

// ─── Safety Overrides ─────────────────────────────────────────────────

export const SAFETY_OVERRIDES = [
    'migration_detected',
    'rls_policy_change',
    'env_secret_change',
    'agents_meta_change',
    'excessive_files_changed',
] as const;

export type SafetyOverride = typeof SAFETY_OVERRIDES[number];
