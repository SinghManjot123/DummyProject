---
name: create-branch
description: Create a new Git branch from the latest main branch using the exact branch name provided by the user.
---

# Create Git Branch

When the user provides a branch name, create the branch from the latest `main` branch and switch to it.

## Workflow

1. Verify this is a Git repository:
   `git rev-parse --is-inside-work-tree`

2. Check the working tree:
   `git status --short`

   - Never discard, reset, clean, stash, or commit user changes automatically.
   - If changes prevent safely switching to `main`, stop.

3. Switch to `main`:
   `git switch main`

   - Do not create `main` if it does not exist.

4. Pull the latest `main`:
   `git pull origin main`

   - If this fails, stop and do not create the new branch.

5. Check whether the requested branch already exists:
   `git branch --list "<branch-name>"`
   `git ls-remote --heads origin "<branch-name>"`

   - If it exists locally or remotely, do not overwrite it.

6. Create and switch to the branch using the EXACT name provided by the user:
   `git switch -c "<branch-name>"`

7. Verify:
   `git branch --show-current`

8. Report:
   `✅ Branch created successfully`
   `Branch: <branch-name>`
   `Base: main`
   `Status: switched to <branch-name>`

## Rules

- Use the exact branch name provided by the user.
- Do not generate, rename, or modify the branch name.
- Do not push, commit, stash, delete, or force-push.
- Never use `git reset --hard` or `git clean`.
- Never overwrite an existing branch.
- Do not claim success unless the Git command actually succeeded.
- Use the available terminal/shell tool to execute the commands.
- The user should only need to provide the branch name.

## Example

User: `Create branch feature/user-login`

Execute:

`git switch main`
`git pull origin main`
`git switch -c feature/user-login`

Then verify and report the result.
