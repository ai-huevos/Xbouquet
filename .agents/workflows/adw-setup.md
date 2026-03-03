---
description: Sets up the Git workspace and branch strategy for Agentic Development Workflows.
---
# /adw-setup

When the USER invokes `/adw-setup`, execute the following steps to orchestrate the 3-branch strategy:

// turbo-all

1. **Initialize Git** (if not already initialized):
   - `git init`

2. **Setup Main Branch** (Production):
   - `git checkout -B main`
   - `git add .`
   - `git commit -m "chore: initial project freeze for ADW"` (ignore error if nothing to commit)

3. **Setup Dev Branch** (Active Development):
   - `git checkout -b dev`
   
4. **Setup Fix/Bugs Branch** (Hotfixes):
   - `git checkout -b fix/bugs`
   - `git checkout dev` (Return to dev branch to prepare for Dev Sessions)

5. **Finalization**:
   - Call `notify_user` to confirm that the workspace `main`, `dev`, and `fix/bugs` branches have been established and we are currently on `dev`, ready to accept `/adw-start` commands.
