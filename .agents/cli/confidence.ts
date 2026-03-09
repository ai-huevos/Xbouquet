/**
 * ADW CLI — Confidence Scorer
 * 
 * The quality inspector. Computes a deterministic confidence score
 * using a 5-factor weighted algorithm. Pure math — no LLM opinions.
 * 
 * This is what decides whether to auto-ship or pause for human review.
 */

import type { ConfidenceBreakdown, SafetyOverride } from './types.js';
import { SAFETY_OVERRIDES } from './types.js';
import * as gitOps from './git.js';

// ─── Scoring Weights ──────────────────────────────────────────────────

const WEIGHTS = {
    test_gates: 0.30,
    files_changed: 0.20,
    retries: 0.20,
    schema_changes: 0.15,
    suit_compliance: 0.15,
} as const;

// ─── Factor Scoring Functions ─────────────────────────────────────────

function scoreTestGates(gatesPassed: number, totalGates: number): number {
    if (totalGates === 0) return 10;
    const ratio = gatesPassed / totalGates;
    if (ratio === 1) return 10;
    if (ratio >= 0.75) return 7;
    if (ratio >= 0.5) return 5;
    return 3;
}

function scoreFilesChanged(fileCount: number): number {
    if (fileCount < 10) return 10;
    if (fileCount <= 15) return 7;
    if (fileCount <= 25) return 5;
    return 3;
}

function scoreRetries(retryCount: number): number {
    if (retryCount === 0) return 10;
    if (retryCount === 1) return 5;
    return 3;
}

function scoreSchemaChanges(hasMigration: boolean, hasRLS: boolean): number {
    if (!hasMigration) return 10;
    if (hasRLS) return 3; // RLS changes are security-critical
    return 5;
}

function scoreSuitCompliance(compliance: Record<string, boolean>): number {
    const entries = Object.entries(compliance);
    if (entries.length === 0) return 10; // No suits active
    const passed = entries.filter(([_, v]) => v).length;
    const failed = entries.length - passed;
    return Math.max(0, 10 - (failed * 2));
}

// ─── Safety Override Detection ────────────────────────────────────────

export interface OverrideResult {
    triggered: boolean;
    overrides: SafetyOverride[];
    reasons: string[];
}

export function detectOverrides(
    cwd: string,
    diffRange: string,
    fileCount: number,
): OverrideResult {
    const overrides: SafetyOverride[] = [];
    const reasons: string[] = [];

    if (gitOps.hasMigrations(cwd, diffRange)) {
        overrides.push('migration_detected');
        reasons.push('SQL migration files detected — requires human review');
    }

    if (gitOps.hasRLSChanges(cwd, diffRange)) {
        overrides.push('rls_policy_change');
        reasons.push('RLS policy changes detected — security critical');
    }

    if (gitOps.hasEnvChanges(cwd, diffRange)) {
        overrides.push('env_secret_change');
        reasons.push('.env or secret file changes detected');
    }

    if (gitOps.hasAgentChanges(cwd, diffRange)) {
        overrides.push('agents_meta_change');
        reasons.push('.agents/ meta-files changed');
    }

    if (fileCount > 30) {
        overrides.push('excessive_files_changed');
        reasons.push(`${fileCount} files changed (threshold: 30)`);
    }

    return {
        triggered: overrides.length > 0,
        overrides,
        reasons,
    };
}

// ─── Main Scoring Function ────────────────────────────────────────────

export interface ConfidenceResult {
    score: number;
    breakdown: ConfidenceBreakdown;
    overrides: OverrideResult;
    decision: 'auto_ship' | 'human_review' | 'stop';
    explanation: string;
}

export function computeConfidence(params: {
    gatesPassed: number;
    totalGates: number;
    fileCount: number;
    retryCount: number;
    hasMigration: boolean;
    hasRLS: boolean;
    suitCompliance: Record<string, boolean>;
    cwd: string;
    diffRange: string;
}): ConfidenceResult {
    // 1. Compute raw factor scores
    const breakdown: ConfidenceBreakdown = {
        test_gates: scoreTestGates(params.gatesPassed, params.totalGates),
        files_changed: scoreFilesChanged(params.fileCount),
        retries: scoreRetries(params.retryCount),
        schema_changes: scoreSchemaChanges(params.hasMigration, params.hasRLS),
        suit_compliance: scoreSuitCompliance(params.suitCompliance),
    };

    // 2. Compute weighted score
    let score = Math.round(
        breakdown.test_gates * WEIGHTS.test_gates +
        breakdown.files_changed * WEIGHTS.files_changed +
        breakdown.retries * WEIGHTS.retries +
        breakdown.schema_changes * WEIGHTS.schema_changes +
        breakdown.suit_compliance * WEIGHTS.suit_compliance
    );

    // 3. Check safety overrides
    const overrides = detectOverrides(params.cwd, params.diffRange, params.fileCount);

    // 4. Apply overrides (force max score of 4)
    if (overrides.triggered) {
        score = Math.min(score, 4);
    }

    // 5. Make decision
    let decision: ConfidenceResult['decision'];
    let explanation: string;

    if (score >= 8) {
        decision = 'auto_ship';
        explanation = `Confidence ${score}/10 — auto-shipping (all gates passed, clean diff)`;
    } else if (score >= 5) {
        decision = 'human_review';
        explanation = `Confidence ${score}/10 — pausing for human review`;
        if (overrides.triggered) {
            explanation += `\n  Safety overrides: ${overrides.reasons.join(', ')}`;
        }
    } else {
        decision = 'stop';
        explanation = `Confidence ${score}/10 — stopping for human intervention`;
        if (overrides.triggered) {
            explanation += `\n  Safety overrides: ${overrides.reasons.join(', ')}`;
        }
    }

    return { score, breakdown, overrides, decision, explanation };
}
