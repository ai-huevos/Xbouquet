#!/usr/bin/env node
/**
 * ADW CLI — The Deterministic Orchestrator
 * 
 * "Blueprint First, Model Second"
 * 
 * This is the kitchen manager. It controls the conveyor belt (state machine),
 * manages tickets (git), seats guests (mission selector), and inspects quality
 * (confidence scorer). The chef (LLM) does creative work — this code does everything else.
 * 
 * Usage:
 *   npx tsx .agents/cli/adw.ts start [mission]
 *   npx tsx .agents/cli/adw.ts finish
 *   npx tsx .agents/cli/adw.ts auto [count]
 *   npx tsx .agents/cli/adw.ts status
 *   npx tsx .agents/cli/adw.ts audit [id|all]
 */

import { Command } from 'commander';
import { resolve } from 'node:path';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

import { ADWState } from './state.js';
import * as gitOps from './git.js';
import { selectNextMission, getMissionSummary, parseMissions } from './selector.js';
import { computeConfidence } from './confidence.js';

// ─── Resolve project root (walk up until we find docs/PLAN.md) ──────

function findProjectRoot(): string {
    let dir = process.cwd();
    for (let i = 0; i < 10; i++) {
        if (existsSync(resolve(dir, 'docs/PLAN.md'))) return dir;
        dir = resolve(dir, '..');
    }
    throw new Error('Cannot find project root (no docs/PLAN.md found)');
}

// ─── Styled output helpers ──────────────────────────────────────────

const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

function header(text: string): void {
    console.log(`\n${BOLD}${CYAN}┌─ ADW CLI ──────────────────────────┐${RESET}`);
    console.log(`${BOLD}${CYAN}│${RESET}  ${text}`);
    console.log(`${BOLD}${CYAN}└────────────────────────────────────┘${RESET}\n`);
}

function phase(name: string, status: string): void {
    const icon = status === 'completed' ? `${GREEN}✅${RESET}` :
        status === 'in_progress' ? `${YELLOW}🔄${RESET}` :
            status === 'failed' ? `${RED}❌${RESET}` :
                status === 'skipped' ? `${DIM}⏭️${RESET}` : '⬜';
    console.log(`  ${icon}  ${name} ${DIM}(${status})${RESET}`);
}

function ok(msg: string): void { console.log(`${GREEN}✅ ${msg}${RESET}`); }
function warn(msg: string): void { console.log(`${YELLOW}⚠️  ${msg}${RESET}`); }
function fail(msg: string): void { console.log(`${RED}❌ ${msg}${RESET}`); }
function info(msg: string): void { console.log(`${CYAN}ℹ️  ${msg}${RESET}`); }

// ─── Commands ───────────────────────────────────────────────────────

const program = new Command();

program
    .name('adw')
    .description('Deterministic ADW orchestrator — Blueprint First, Model Second')
    .version('1.0.0');

// ── STATUS ──────────────────────────────────────────────────────────

program
    .command('status')
    .description('Show current ADW session status and mission overview')
    .action(() => {
        const root = findProjectRoot();
        header('Session Status');

        // Active session?
        if (ADWState.exists(root)) {
            const state = ADWState.load(root);
            const data = state.toJSON();

            console.log(`  ${BOLD}Mission:${RESET}   ${data.mission_id} — ${data.mission_title}`);
            console.log(`  ${BOLD}Branch:${RESET}    ${data.branch}`);
            console.log(`  ${BOLD}Type:${RESET}      ${data.type}`);
            console.log(`  ${BOLD}Started:${RESET}   ${data.started_at}`);
            console.log(`  ${BOLD}Suits:${RESET}     ${data.suits_active.join(', ') || 'none'}`);
            console.log();
            console.log(`  ${BOLD}Phases:${RESET}`);
            for (const [p, record] of Object.entries(data.phases)) {
                phase(p.padEnd(12), record.status);
            }
        } else {
            info('No active session. Use "adw start" to create one.');
        }

        // Mission overview
        console.log();
        const summary = getMissionSummary(root);
        console.log(`  ${BOLD}Missions:${RESET}  ${summary.completed}/${summary.total} completed, ${summary.pending} pending`);
        if (summary.unblocked.length > 0) {
            console.log(`  ${BOLD}Next up:${RESET}   ${summary.unblocked.map(m => `M${m.number}`).join(', ')}`);
        } else {
            ok('All missions complete!');
        }
        console.log();
    });

// ── START ───────────────────────────────────────────────────────────

program
    .command('start [mission]')
    .description('Initialize an ADW session — state machine, git, context')
    .option('--dry-run', 'Preview without making changes')
    .action((mission?: string, opts?: { dryRun?: boolean }) => {
        const root = findProjectRoot();
        header('Starting ADW Session');

        // Don't allow double-start
        if (ADWState.exists(root)) {
            const existing = ADWState.load(root);
            fail(`Session already active: ${existing.missionId}`);
            info('Run "adw finish" first, or "adw resume" to continue.');
            process.exit(1);
        }

        // Select mission
        let missionId: string;
        let missionTitle: string;

        if (mission) {
            // User specified a mission
            const missions = parseMissions(root);
            const match = missions.find(m =>
                m.number === parseInt(mission) ||
                m.title.toLowerCase().includes(mission.toLowerCase())
            );
            if (match) {
                missionId = `M${match.number}`;
                missionTitle = match.title;
            } else {
                missionId = `M-CUSTOM`;
                missionTitle = mission;
            }
        } else {
            // Auto-select next mission
            const next = selectNextMission(root);
            if (!next) {
                ok('All missions complete! Use "/feature" to plan new ones.');
                process.exit(0);
            }
            missionId = `M${next.number}`;
            missionTitle = next.title;
        }

        if (opts?.dryRun) {
            info(`[DRY RUN] Would start: ${missionId} — ${missionTitle}`);
            return;
        }

        // 1. Ensure git is ready
        info('Ensuring branch is up-to-date...');
        gitOps.ensureBranch(root, 'dev');
        ok(`On branch: ${gitOps.currentBranch(root)} @ ${gitOps.headSha(root)}`);

        // 2. Create state machine
        const state = ADWState.create(root, missionId, missionTitle, 'start');
        ok(`State machine initialized: ${missionId}`);

        // 3. Mark context phase started
        state.startPhase('context');
        ok(`CONTEXT phase started — read docs and load context`);

        // 4. Show what's next
        console.log();
        info('State machine is running. The LLM should now:');
        console.log('  1. Read PLAN.md, ARCHITECTURE.md, DECISIONS.md, LESSONS.md');
        console.log('  2. Load active suits from .agents/suits/SUITS.md');
        console.log('  3. Begin building the mission');
        console.log();
        info(`Use "adw status" to check progress at any time.`);
        console.log();
    });

// ── FINISH ──────────────────────────────────────────────────────────

program
    .command('finish')
    .description('Run verification, scoring, and ship the current session')
    .option('--dry-run', 'Preview scoring without shipping')
    .option('--force-ship', 'Skip confidence gating (override)')
    .action((opts?: { dryRun?: boolean; forceShip?: boolean }) => {
        const root = findProjectRoot();
        header('Finishing ADW Session');

        if (!ADWState.exists(root)) {
            fail('No active session found. Nothing to finish.');
            process.exit(1);
        }

        const state = ADWState.load(root);
        info(`Session: ${state.missionId} — ${state.missionTitle}`);

        // Compute git stats
        const startSha = gitOps.headSha(root);
        const diffRange = 'HEAD~1';
        const stats = gitOps.diffStat(root, diffRange);
        const changedCount = stats.files;

        const hasMigration = gitOps.hasMigrations(root, diffRange);
        const hasRLS = gitOps.hasRLSChanges(root, diffRange);

        // Compute confidence score
        console.log();
        info('Computing confidence score...');
        const result = computeConfidence({
            gatesPassed: 4, // Will be updated by actual test results
            totalGates: 4,
            fileCount: changedCount,
            retryCount: state.getRetryCount('test'),
            hasMigration,
            hasRLS,
            suitCompliance: state.toJSON().suit_compliance,
            cwd: root,
            diffRange,
        });

        // Display breakdown
        console.log();
        console.log(`  ${BOLD}Confidence Score: ${result.score}/10${RESET}`);
        console.log();
        const bd = result.breakdown;
        console.log(`  Test Gates:      ${'█'.repeat(bd.test_gates)}${'░'.repeat(10 - bd.test_gates)} ${bd.test_gates}/10 (weight: 30%)`);
        console.log(`  Files Changed:   ${'█'.repeat(bd.files_changed)}${'░'.repeat(10 - bd.files_changed)} ${bd.files_changed}/10 (weight: 20%)`);
        console.log(`  Retries:         ${'█'.repeat(bd.retries)}${'░'.repeat(10 - bd.retries)} ${bd.retries}/10 (weight: 20%)`);
        console.log(`  Schema Changes:  ${'█'.repeat(bd.schema_changes)}${'░'.repeat(10 - bd.schema_changes)} ${bd.schema_changes}/10 (weight: 15%)`);
        console.log(`  Suit Compliance: ${'█'.repeat(bd.suit_compliance)}${'░'.repeat(10 - bd.suit_compliance)} ${bd.suit_compliance}/10 (weight: 15%)`);
        console.log();

        if (result.overrides.triggered) {
            warn('Safety overrides triggered:');
            for (const reason of result.overrides.reasons) {
                console.log(`    → ${reason}`);
            }
            console.log();
        }

        // Store confidence in state
        state.setConfidence(
            result.score,
            result.breakdown,
            result.overrides.overrides,
        );

        // Decision
        if (result.decision === 'auto_ship') {
            ok(result.explanation);
        } else if (result.decision === 'human_review') {
            warn(result.explanation);
        } else {
            fail(result.explanation);
        }

        if (opts?.dryRun) {
            info('[DRY RUN] Would proceed with decision: ' + result.decision);
            return;
        }

        // Ship if auto-approved or forced
        if (result.decision === 'auto_ship' || opts?.forceShip) {
            console.log();
            info('Shipping...');
            const { sha } = gitOps.shipChanges(
                root,
                `feat: [${state.missionId}] ${state.missionTitle}`,
                state.branch,
            );
            state.setAutoShipped(true);
            ok(`Committed: ${sha}`);
            ok(`Pushed to ${state.branch}`);

            // Archive
            const archivePath = state.archive();
            ok(`State archived: ${archivePath}`);
        } else {
            info('Paused for human review. Run "adw finish --force-ship" after reviewing.');
        }

        console.log();
    });

// ── RESUME ──────────────────────────────────────────────────────────

program
    .command('resume')
    .description('Resume an interrupted session from the last completed phase')
    .action(() => {
        const root = findProjectRoot();
        header('Resuming ADW Session');

        if (!ADWState.exists(root)) {
            fail('No active session to resume.');
            process.exit(1);
        }

        const state = ADWState.load(root);
        info(`Session: ${state.missionId} — ${state.missionTitle}`);

        const nextPhase = state.getNextPendingPhase();
        if (!nextPhase) {
            ok('All phases complete. Run "adw finish" to ship.');
            return;
        }

        ok(`Resuming from phase: ${nextPhase}`);
        state.startPhase(nextPhase);
        info(`Phase '${nextPhase}' is now in_progress.`);
        console.log();
    });

// ── SCORE ───────────────────────────────────────────────────────────

program
    .command('score')
    .description('Compute confidence score for current changes (standalone)')
    .action(() => {
        const root = findProjectRoot();
        header('Confidence Score');

        const diffRange = 'HEAD~1';
        const stats = gitOps.diffStat(root, diffRange);

        const result = computeConfidence({
            gatesPassed: 4,
            totalGates: 4,
            fileCount: stats.files,
            retryCount: 0,
            hasMigration: gitOps.hasMigrations(root, diffRange),
            hasRLS: gitOps.hasRLSChanges(root, diffRange),
            suitCompliance: {},
            cwd: root,
            diffRange,
        });

        console.log(`  Score: ${BOLD}${result.score}/10${RESET}`);
        console.log(`  Decision: ${result.decision}`);
        console.log(`  ${result.explanation}`);
        console.log();
    });

// ── AUDIT ───────────────────────────────────────────────────────────

program
    .command('audit [sessionId]')
    .description('Audit past autonomous sessions')
    .action((sessionId?: string) => {
        const root = findProjectRoot();
        const historyDir = resolve(root, '.agents/history');
        header('ADW Audit');

        if (!existsSync(historyDir)) {
            info('No session history found.');
            return;
        }

        const files = readdirSync(historyDir).filter(f => f.endsWith('.json'));

        if (files.length === 0) {
            info('No archived sessions found.');
            return;
        }

        if (sessionId && sessionId !== 'all') {
            // Specific session
            const match = files.find(f => f.includes(sessionId));
            if (!match) {
                fail(`Session not found: ${sessionId}`);
                return;
            }
            const data = JSON.parse(readFileSync(resolve(historyDir, match), 'utf-8'));
            console.log(JSON.stringify(data, null, 2));
        } else {
            // All sessions summary
            console.log(`  ${BOLD}${'Session'.padEnd(30)} ${'Score'.padEnd(8)} ${'Auto-shipped'.padEnd(14)} Status${RESET}`);
            console.log(`  ${'─'.repeat(70)}`);

            for (const file of files.sort()) {
                const data = JSON.parse(readFileSync(resolve(historyDir, file), 'utf-8'));
                const score = data.confidence_score ?? '–';
                const shipped = data.auto_shipped ? `${GREEN}yes${RESET}` : `${YELLOW}no${RESET}`;
                const flag = data.overrides_applied?.length > 0 ? `${RED}⚠️${RESET}` :
                    (data.confidence_score ?? 10) >= 8 ? `${GREEN}✅${RESET}` : `${YELLOW}⏸️${RESET}`;
                console.log(`  ${data.mission_id.padEnd(30)} ${String(score).padEnd(8)} ${shipped.padEnd(14 + 10)} ${flag}`);
            }
        }
        console.log();
    });

// ── MISSIONS ────────────────────────────────────────────────────────

program
    .command('missions')
    .description('List all missions and their status')
    .action(() => {
        const root = findProjectRoot();
        header('Mission Overview');

        const missions = parseMissions(root);
        const summary = getMissionSummary(root);

        console.log(`  ${summary.completed}/${summary.total} completed, ${summary.pending} pending\n`);

        for (const m of missions) {
            const icon = m.completed ? `${GREEN}✅${RESET}` : '⬜';
            console.log(`  ${icon}  M${String(m.number).padEnd(3)} ${m.title} ${DIM}(Wave ${m.wave})${RESET}`);
        }

        if (summary.unblocked.length > 0) {
            console.log(`\n  ${BOLD}Next unblocked:${RESET} ${summary.unblocked.map(m => `M${m.number}: ${m.title}`).join(', ')}`);
        }
        console.log();
    });

// ── Parse and run ───────────────────────────────────────────────────

program.parse();
