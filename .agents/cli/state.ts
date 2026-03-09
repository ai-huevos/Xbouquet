/**
 * ADW CLI — Deterministic State Machine
 * 
 * This is the conveyor belt. It guarantees:
 * - Phases execute in order (no skipping)
 * - State transitions are atomic (write to disk on every change)
 * - Timestamps and durations are tracked automatically
 * - Crashes are recoverable (state persists on disk)
 * 
 * The LLM never touches this. Code drives the bus.
 */

import { readFileSync, writeFileSync, existsSync, copyFileSync, unlinkSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type {
    ADWStateData, Phase, PhaseRecord, PhaseStatus,
    WorkflowType, WORKFLOW_PHASES,
} from './types.js';
import { PHASES, PHASE_ORDER } from './types.js';

const STATE_FILE = 'adw_state.json';
const HISTORY_DIR = '.agents/history';

export class ADWState {
    private data: ADWStateData;
    private projectRoot: string;
    private filePath: string;

    private constructor(data: ADWStateData, projectRoot: string) {
        this.data = data;
        this.projectRoot = projectRoot;
        this.filePath = join(projectRoot, STATE_FILE);
    }

    // ─── Factory Methods ──────────────────────────────────────────────

    /**
     * Create a brand new session. Guaranteed to write to disk.
     */
    static create(
        projectRoot: string,
        missionId: string,
        missionTitle: string,
        type: WorkflowType,
        branch: string = 'dev',
    ): ADWState {
        const now = new Date().toISOString();
        const phases: Record<string, PhaseRecord> = {};

        for (const phase of PHASES) {
            phases[phase] = { status: 'pending' };
        }

        const data: ADWStateData = {
            version: 2,
            mission_id: missionId,
            mission_title: missionTitle,
            branch,
            type,
            started_at: now,
            current_phase: PHASES[0],
            suits_active: [],
            phases: phases as Record<Phase, PhaseRecord>,
            suit_compliance: {},
        };

        const state = new ADWState(data, projectRoot);
        state.flush();
        return state;
    }

    /**
     * Load existing session from disk. Throws if no session exists.
     */
    static load(projectRoot: string): ADWState {
        const filePath = join(projectRoot, STATE_FILE);
        if (!existsSync(filePath)) {
            throw new Error(
                `No active ADW session found. Run 'adw start' first.\n` +
                `Expected: ${filePath}`
            );
        }
        const raw = readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw) as ADWStateData;
        return new ADWState(data, projectRoot);
    }

    /**
     * Check if a session exists on disk.
     */
    static exists(projectRoot: string): boolean {
        return existsSync(join(projectRoot, STATE_FILE));
    }

    // ─── Phase Transitions (THE CORE CONTRACT) ────────────────────────

    /**
     * Mark a phase as in-progress. Validates ordering.
     * 
     * RULE: You can only start a phase if:
     *   1. It is currently 'pending' or 'failed' (retry)
     *   2. All previous phases in the workflow are 'completed' or 'skipped'
     */
    startPhase(phase: Phase): void {
        const record = this.data.phases[phase];

        if (record.status !== 'pending' && record.status !== 'failed') {
            throw new Error(
                `Cannot start phase '${phase}': current status is '${record.status}'. ` +
                `Only 'pending' or 'failed' phases can be started.`
            );
        }

        // Validate all prior phases are done
        for (const p of PHASES) {
            if (PHASE_ORDER[p] >= PHASE_ORDER[phase]) break;
            const priorStatus = this.data.phases[p].status;
            if (priorStatus !== 'completed' && priorStatus !== 'skipped') {
                throw new Error(
                    `Cannot start phase '${phase}': prior phase '${p}' is '${priorStatus}'. ` +
                    `All prior phases must be 'completed' or 'skipped'.`
                );
            }
        }

        record.status = 'in_progress';
        record.started_at = new Date().toISOString();
        record.retries = (record.retries ?? 0) + (record.status === 'failed' ? 1 : 0);
        this.data.current_phase = phase;
        this.flush();
    }

    /**
     * Mark a phase as completed. Calculates duration.
     */
    completePhase(phase: Phase): void {
        const record = this.data.phases[phase];
        if (record.status !== 'in_progress') {
            throw new Error(
                `Cannot complete phase '${phase}': status is '${record.status}', expected 'in_progress'.`
            );
        }

        const now = new Date();
        record.status = 'completed';
        record.completed_at = now.toISOString();

        if (record.started_at) {
            record.duration_ms = now.getTime() - new Date(record.started_at).getTime();
        }

        this.flush();
    }

    /**
     * Mark a phase as failed with an error message.
     */
    failPhase(phase: Phase, error: string): void {
        const record = this.data.phases[phase];
        record.status = 'failed';
        record.error = error;
        record.completed_at = new Date().toISOString();
        this.flush();
    }

    /**
     * Skip a phase (used by workflows that don't include all phases).
     */
    skipPhase(phase: Phase): void {
        const record = this.data.phases[phase];
        if (record.status !== 'pending') {
            throw new Error(`Cannot skip phase '${phase}': status is '${record.status}'.`);
        }
        record.status = 'skipped';
        this.flush();
    }

    // ─── Metadata Setters ─────────────────────────────────────────────

    setSuitsActive(suits: string[]): void {
        this.data.suits_active = suits;
        this.flush();
    }

    setSuitCompliance(suitName: string, passed: boolean): void {
        this.data.suit_compliance[suitName] = passed;
        this.flush();
    }

    setConfidence(score: number, breakdown: ADWStateData['confidence_breakdown'], overrides: string[]): void {
        this.data.confidence_score = score;
        this.data.confidence_breakdown = breakdown;
        this.data.overrides_applied = overrides;
        this.flush();
    }

    setAutoShipped(shipped: boolean): void {
        this.data.auto_shipped = shipped;
        this.flush();
    }

    setAutoSelectedMission(missionId: string): void {
        this.data.auto_selected_mission = missionId;
        this.flush();
    }

    // ─── Getters ──────────────────────────────────────────────────────

    get missionId(): string { return this.data.mission_id; }
    get missionTitle(): string { return this.data.mission_title; }
    get branch(): string { return this.data.branch; }
    get type(): WorkflowType { return this.data.type; }
    get currentPhase(): Phase { return this.data.current_phase; }
    get suitsActive(): string[] { return this.data.suits_active; }
    get confidenceScore(): number | undefined { return this.data.confidence_score; }

    getPhase(phase: Phase): PhaseRecord {
        return { ...this.data.phases[phase] };
    }

    getRetryCount(phase: Phase): number {
        return this.data.phases[phase].retries ?? 0;
    }

    /**
     * Get the next pending phase, or null if all are done.
     */
    getNextPendingPhase(): Phase | null {
        for (const phase of PHASES) {
            if (this.data.phases[phase].status === 'pending') {
                return phase;
            }
        }
        return null;
    }

    /**
     * Get a JSON snapshot (for display/logging).
     */
    toJSON(): ADWStateData {
        return structuredClone(this.data);
    }

    // ─── Persistence ──────────────────────────────────────────────────

    /**
     * Archive the completed state to .agents/history/ and remove the active file.
     * Returns the path to the archived file.
     */
    archive(): string {
        const historyDir = join(this.projectRoot, HISTORY_DIR);
        mkdirSync(historyDir, { recursive: true });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const archiveName = `adw_state_${this.data.mission_id}_${timestamp}.json`;
        const archivePath = join(historyDir, archiveName);

        // Set completion time
        this.data.completed_at = new Date().toISOString();
        this.flush();

        // Copy then remove
        copyFileSync(this.filePath, archivePath);
        unlinkSync(this.filePath);

        return archivePath;
    }

    /**
     * Atomic write to disk. Called on every state change.
     * This is the guarantee — if the process crashes, the last state is on disk.
     */
    private flush(): void {
        const json = JSON.stringify(this.data, null, 2) + '\n';
        // Atomic write: write to temp file, then rename
        const tmpPath = this.filePath + '.tmp';
        writeFileSync(tmpPath, json, 'utf-8');
        const { renameSync } = require('node:fs');
        renameSync(tmpPath, this.filePath);
    }
}
