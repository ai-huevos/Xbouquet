/**
 * ADW CLI — Mission Selector
 * 
 * The host who seats guests in order. Parses PLAN.md with regex,
 * identifies pending missions, respects the DAG, returns the next one.
 * 
 * Pure logic — no LLM involved.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Mission } from './types.js';

const PLAN_FILE = 'docs/PLAN.md';

/**
 * Parse PLAN.md and extract all missions with their completion status.
 */
export function parseMissions(projectRoot: string): Mission[] {
    const planPath = join(projectRoot, PLAN_FILE);
    const content = readFileSync(planPath, 'utf-8');
    const missions: Mission[] = [];

    let currentWave = 0;

    for (const line of content.split('\n')) {
        // Detect wave headers: "## 🌊 WAVE 1:" or "## 🌊 WAVE 10:"
        const waveMatch = line.match(/^##\s.*WAVE\s+(\d+)/i);
        if (waveMatch) {
            currentWave = parseInt(waveMatch[1]);
            continue;
        }

        // Detect missions: "- [x] **Mission 1: Title**" or "- [ ] **Mission 34: Title**"
        const missionMatch = line.match(/^-\s+\[(x| )\]\s+\*\*Mission\s+(\d+):\s*(.+?)\*\*/);
        if (missionMatch) {
            missions.push({
                number: parseInt(missionMatch[2]),
                title: missionMatch[3].trim(),
                completed: missionMatch[1] === 'x',
                wave: currentWave,
                dependencies: [],
            });
        }
    }

    return missions;
}

/**
 * Parse the mermaid DAG from PLAN.md to extract mission dependencies.
 * 
 * Looks for patterns like: M1 --> M2, M2 --> M3
 */
export function parseDependencies(projectRoot: string): Map<number, number[]> {
    const planPath = join(projectRoot, PLAN_FILE);
    const content = readFileSync(planPath, 'utf-8');
    const deps = new Map<number, number[]>();

    // Find all edges: M1["..."] --> M2["..."] or M1 --> M2
    const edgeRegex = /M(\d+)(?:\[.*?\])?\s*-->\s*M(\d+)(?:\[.*?\])?/g;
    let match;

    while ((match = edgeRegex.exec(content)) !== null) {
        const from = parseInt(match[1]);
        const to = parseInt(match[2]);

        if (!deps.has(to)) {
            deps.set(to, []);
        }
        deps.get(to)!.push(from);
    }

    return deps;
}

/**
 * Get all unblocked pending missions.
 * A mission is unblocked if all its dependencies are completed.
 */
export function getUnblockedMissions(projectRoot: string): Mission[] {
    const missions = parseMissions(projectRoot);
    const deps = parseDependencies(projectRoot);
    const completedSet = new Set(missions.filter(m => m.completed).map(m => m.number));

    // Attach dependencies to missions
    for (const mission of missions) {
        mission.dependencies = deps.get(mission.number) ?? [];
    }

    return missions.filter(m => {
        if (m.completed) return false;
        // All dependencies must be completed
        return m.dependencies.every(dep => completedSet.has(dep));
    });
}

/**
 * Select the next mission to execute.
 * Strategy: pick the unblocked mission with the smallest number.
 */
export function selectNextMission(projectRoot: string): Mission | null {
    const unblocked = getUnblockedMissions(projectRoot);
    if (unblocked.length === 0) return null;
    return unblocked.sort((a, b) => a.number - b.number)[0];
}

/**
 * Get a summary of the mission state for display.
 */
export function getMissionSummary(projectRoot: string): {
    total: number;
    completed: number;
    pending: number;
    unblocked: Mission[];
} {
    const missions = parseMissions(projectRoot);
    const unblocked = getUnblockedMissions(projectRoot);

    return {
        total: missions.length,
        completed: missions.filter(m => m.completed).length,
        pending: missions.filter(m => !m.completed).length,
        unblocked,
    };
}
