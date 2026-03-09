---
description: Configures automated triggers that start ADW sessions without manual invocation.
---
# /adw-triggers

When the USER invokes `/adw-triggers [action]`, execute the following protocol:

> **Purpose:** Configure automatic triggers that kick off ADW sessions. This moves us from **Stage 2** (human-triggered) toward **Stage 3** (event-triggered) autonomy.

## Available Actions

### `/adw-triggers list` — Show Current Triggers

Display all configured triggers from `.agents/triggers.json`:
```json
{
  "triggers": [
    { "type": "file-watch", "path": "docs/PLAN.md", "event": "modify", "action": "/adw-start next-pending", "enabled": true },
    { "type": "schedule", "cron": "0 9 * * 1-5", "action": "/adw-metrics", "enabled": true },
    { "type": "webhook", "endpoint": "/api/adw-hook", "secret": "...", "action": "/adw-start", "enabled": false }
  ]
}
```

---

### `/adw-triggers add file-watch` — Watch Files for Changes

1. Configure a file watcher using `fswatch` or `chokidar`:
   ```bash
   # Example: Auto-start next mission when PLAN.md is updated
   fswatch -o docs/PLAN.md | xargs -n1 -I{} echo "PLAN.md changed — next mission ready"
   ```

2. Supported triggers:
   | Trigger | What Happens | Use Case |
   |---------|-------------|----------|
   | `PLAN.md` modified | `/adw-start next-pending` | Auto-pick next mission after planning |
   | `LESSONS.md` modified | `/adw-metrics lesson-capture` | Track lesson velocity |
   | `adw_state.json` created | Event log | Session observability |
   | `.agents/suits/SUITS.md` modified | Reload suit configuration | Live suit reconfiguration |

---

### `/adw-triggers add schedule` — Cron-based Triggers

1. Create launchd plist (macOS) or cron entry for scheduled ADW actions:

   ```xml
   <!-- ~/Library/LaunchAgents/com.xbuke.adw-metrics.plist -->
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
   <dict>
     <key>Label</key>
     <string>com.xbuke.adw-metrics</string>
     <key>ProgramArguments</key>
     <array>
       <string>/bin/bash</string>
       <string>-c</string>
       <string>cd /Volumes/deathstar/Development/Xpress\ Buke && echo "/adw-metrics" > .agents/trigger-queue</string>
     </array>
     <key>StartCalendarInterval</key>
     <dict>
       <key>Hour</key><integer>9</integer>
       <key>Minute</key><integer>0</integer>
     </dict>
   </dict>
   </plist>
   ```

2. Supported schedules:
   | Schedule | Action | Purpose |
   |----------|--------|---------|
   | Daily 9 AM weekdays | `/adw-metrics` | Morning velocity report |
   | After each PR merge | `/adw-start next-pending` | Continuous delivery |
   | Weekly Friday 5 PM | `/adw-metrics --weekly` | Weekly retrospective |

---

### `/adw-triggers add webhook` — External Event Triggers

1. Create a Next.js API route for receiving webhooks:

   ```typescript
   // src/app/api/adw-hook/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   import { writeFileSync } from 'fs';
   import { join } from 'path';

   export async function POST(req: NextRequest) {
     const secret = req.headers.get('x-adw-secret');
     if (secret !== process.env.ADW_WEBHOOK_SECRET) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }

     const body = await req.json();
     const triggerFile = join(process.cwd(), '.agents', 'trigger-queue');

     // Write trigger to queue file — agent picks it up on next check
     writeFileSync(triggerFile, JSON.stringify({
       action: body.action || '/adw-start',
       mission: body.mission || 'next-pending',
       triggered_by: 'webhook',
       triggered_at: new Date().toISOString(),
       payload: body
     }));

     return NextResponse.json({ status: 'queued' });
   }
   ```

2. Supported webhook sources:
   | Source | Event | Action |
   |--------|-------|--------|
   | GitHub | `issues.opened` with `adw` label | `/adw-start {issue_title}` |
   | GitHub | `pull_request.merged` to `dev` | `/adw-start next-pending` |
   | Supabase | Database function trigger | `/adw-bugfix {error}` |
   | Slack | `/adw` slash command | `/adw-start {text}` |

---

### `/adw-triggers add queue` — Trigger Queue Pattern

The **trigger queue** is the bridge between automated events and the IDE agent:

```
.agents/trigger-queue    ← JSON file written by triggers
                          Agent checks on session start
                          If non-empty → execute the action
                          After execution → clear the file
```

This avoids the need for a persistent daemon. The agent checks the queue at the start of any `/adw-start` or `/adw-resume` session.

**Add to `/adw-start`:** Before Context Initialization, check `.agents/trigger-queue`:
```markdown
0. **Trigger Queue Check** (before Context):
   - If `.agents/trigger-queue` exists and is non-empty:
     - Read the queued action
     - Use queued mission as the mission parameter
     - Clear the queue file
   - This allows scheduled/webhook triggers to feed missions to the agent
```

---

## Trigger Safety

> [!WARNING]
> Triggers should **never** auto-ship. They should auto-start sessions that still require human REVIEW gates. This maintains Stage 2 safety while adding Stage 3 input diversity.

| Trigger Type | Auto-starts? | Still has REVIEW gate? | Stage |
|---|---|---|---|
| File watch | ✅ | ✅ | 2.5 |
| Schedule (cron) | ✅ | ✅ | 2.5 |
| Webhook | ✅ | ✅ | 2.5 |
| Full autonomous | ✅ | ❌ (auto-ship) | 3.0 |

**We implement Stage 2.5 now.** Full Stage 3 (auto-ship) requires validated test gates and trust in suit compliance.
