/**
 * ADW CLI — Deterministic Git Operations
 * 
 * The kitchen's ticket system. Every git command is:
 * - Deterministic (execSync, not LLM-driven)
 * - Logged (stdout captured)
 * - Error-handled (throws with clear messages)
 * 
 * The LLM never runs git commands. This module does.
 */

import { execSync } from 'node:child_process';

function git(args: string, cwd: string): string {
    try {
        return execSync(`git ${args}`, { cwd, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    } catch (err: any) {
        const stderr = err.stderr?.toString().trim() ?? '';
        throw new Error(`git ${args} failed: ${stderr || err.message}`);
    }
}

// ─── Read Operations ──────────────────────────────────────────────────

/** Get current branch name */
export function currentBranch(cwd: string): string {
    return git('rev-parse --abbrev-ref HEAD', cwd);
}

/** Get short SHA of HEAD */
export function headSha(cwd: string): string {
    return git('rev-parse --short HEAD', cwd);
}

/** Get list of changed files (staged + unstaged) */
export function changedFiles(cwd: string): string[] {
    const output = git('status --porcelain', cwd);
    if (!output) return [];
    return output.split('\n').map(line => line.slice(3).trim());
}

/** Get diff stat for a range */
export function diffStat(cwd: string, range: string): { files: number; insertions: number; deletions: number } {
    const output = git(`diff --shortstat ${range}`, cwd);
    if (!output) return { files: 0, insertions: 0, deletions: 0 };

    const filesMatch = output.match(/(\d+) files? changed/);
    const insMatch = output.match(/(\d+) insertions?/);
    const delMatch = output.match(/(\d+) deletions?/);

    return {
        files: filesMatch ? parseInt(filesMatch[1]) : 0,
        insertions: insMatch ? parseInt(insMatch[1]) : 0,
        deletions: delMatch ? parseInt(delMatch[1]) : 0,
    };
}

/** Check if there are SQL migration files in the diff */
export function hasMigrations(cwd: string, range: string): boolean {
    try {
        const output = git(`diff --name-only ${range}`, cwd);
        return output.split('\n').some(f => f.endsWith('.sql'));
    } catch {
        return false;
    }
}

/** Check if .agents/ files changed (meta-changes) */
export function hasAgentChanges(cwd: string, range: string): boolean {
    try {
        const output = git(`diff --name-only ${range}`, cwd);
        return output.split('\n').some(f => f.startsWith('.agents/'));
    } catch {
        return false;
    }
}

/** Check if .env or secret files changed */
export function hasEnvChanges(cwd: string, range: string): boolean {
    try {
        const output = git(`diff --name-only ${range}`, cwd);
        return output.split('\n').some(f =>
            f.includes('.env') || f.includes('secret') || f.includes('credential')
        );
    } catch {
        return false;
    }
}

/** Check if RLS policy SQL is in the diff content */
export function hasRLSChanges(cwd: string, range: string): boolean {
    try {
        const output = git(`diff ${range}`, cwd);
        return /CREATE\s+POLICY|ALTER\s+POLICY|DROP\s+POLICY|ENABLE\s+ROW\s+LEVEL/i.test(output);
    } catch {
        return false;
    }
}

// ─── Write Operations ─────────────────────────────────────────────────

/** Fetch latest from remote */
export function fetch(cwd: string): void {
    git('fetch', cwd);
}

/** Checkout a branch */
export function checkout(cwd: string, branch: string): void {
    git(`checkout ${branch}`, cwd);
}

/** Pull latest from remote */
export function pull(cwd: string, branch: string): void {
    git(`pull origin ${branch}`, cwd);
}

/** Stage all changes */
export function addAll(cwd: string): void {
    git('add .', cwd);
}

/** Stage specific files */
export function addFiles(cwd: string, files: string[]): void {
    git(`add ${files.map(f => `"${f}"`).join(' ')}`, cwd);
}

/** Commit with message */
export function commit(cwd: string, message: string): string {
    git(`commit -m "${message.replace(/"/g, '\\"')}"`, cwd);
    return headSha(cwd);
}

/** Push to remote */
export function push(cwd: string, branch: string, remote: string = 'origin'): void {
    git(`push ${remote} ${branch}`, cwd);
}

// ─── Composite Operations ─────────────────────────────────────────────

/** Ensure we're on the right branch and up-to-date */
export function ensureBranch(cwd: string, branch: string): void {
    const current = currentBranch(cwd);
    if (current !== branch) {
        checkout(cwd, branch);
    }
    try {
        pull(cwd, branch);
    } catch {
        // Pull may fail if remote doesn't exist yet, that's fine
    }
}

/** Stage, commit, push — the full SHIP operation */
export function shipChanges(
    cwd: string,
    message: string,
    branch: string,
): { sha: string } {
    addAll(cwd);
    const sha = commit(cwd, message);
    push(cwd, branch);
    return { sha };
}
