---
name: create-pr

description: Automatically create a Pull Request from the current Git branch. Use when the user asks to create, open, raise, or submit a PR. Automatically inspect changes, commit relevant changes, push the branch, validate the code, and create the PR without unnecessary user interaction.
---

# Create Pull Request

Automatically prepare and create a Pull Request from the current working branch.

The skill should complete the Git workflow end-to-end whenever it can safely do so.

## User Input

The user may provide:

- PR title
- Feature/task description
- Target/base branch
- Additional PR requirements

Examples:

```text
Create PR for user profile feature
```

```text
Create PR: Add forgot password flow
```

```text
Create PR to develop
```

If the user does not provide a PR title, derive one from the branch name and changes.

---

# Workflow

## 1. Inspect Repository

Run:

```bash
git status --short
git branch --show-current
git remote -v
```

Determine:

- Current branch
- Modified files
- Untracked files
- Staged files
- Remote repository
- Current branch tracking status

Do not assume the repository state.

---

## 2. Determine Target Branch

Determine the target branch using this priority:

1. User-provided target branch.
2. Existing branch/PR configuration.
3. Repository default branch.
4. `main` if no better information exists.

For example:

```bash
git remote show origin
```

Use the discovered default branch rather than blindly assuming `main`.

---

## 3. Inspect Existing Changes

Compare the current branch with the target branch:

```bash
git diff <target-branch>...HEAD
git log <target-branch>..HEAD --oneline
```

Also inspect working-tree changes:

```bash
git diff
git diff --cached
git status --short
```

---

## 4. Handle Untracked and Modified Files Automatically

Do NOT stop merely because untracked or modified files exist.

Determine whether each file is related to the requested work.

### Include files when:

- They clearly belong to the requested feature/fix.
- They are source files required by the change.
- They are tests for the change.
- They are configuration/documentation files required by the change.
- They are explicitly mentioned by the user.

### Exclude files when:

- They are unrelated.
- They are generated artifacts.
- They are IDE/editor files.
- They are temporary files.
- They contain secrets.
- They are build/cache output.

Never commit:

```text
.env
.env.*
node_modules/
Pods/
build/
dist/
coverage/
.DS_Store
*.log
```

unless the repository explicitly tracks them.

If a file such as:

```text
create-pr.prompt.md
```

is clearly part of the requested skill/work, include it.

If it is unrelated to the requested work, leave it untouched.

---

## 5. Determine Whether There Are Changes to Commit

Check whether the branch contains commits ahead of the target branch:

```bash
git log <target-branch>..HEAD --oneline
```

If there are no commits but relevant working-tree changes exist:

1. Stage the relevant files.
2. Create an appropriate commit.
3. Continue with the PR workflow.

Example:

```bash
git add <relevant-files>
git commit -m "<commit message>"
```

Generate the commit message from the actual changes.

Use conventional commits when the repository follows that convention.

Examples:

```text
feat: add user profile feature
fix: resolve login validation issue
chore: update development skill
docs: add pull request workflow
```

---

## 6. Do Not Commit Unrelated Changes

Before committing, review staged files:

```bash
git diff --cached --stat
git diff --cached
```

Only commit files related to the requested work.

Never use:

```bash
git add .
```

blindly.

Prefer:

```bash
git add <specific-files>
```

This prevents unrelated local changes from entering the PR.

---

## 7. Check for Secrets

Before committing, inspect changed files for obvious secrets or credentials.

Do not commit:

- API keys
- Access tokens
- Private keys
- Passwords
- Credentials
- `.env` secrets
- Authentication tokens

If sensitive information is detected, stop and report the affected file.

---

## 8. Validate the Project

Inspect available project scripts.

For Node/React/React Native projects:

```bash
cat package.json
```

Use the project's existing scripts.

Typical checks:

```bash
npm test
npm run lint
npm run typecheck
```

or:

```bash
yarn test
yarn lint
yarn typecheck
```

Run only commands that actually exist.

For React Native projects, also run relevant checks configured by the project.

Do not introduce new validation tools.

---

## 9. Handle Validation Failures

If validation fails:

1. Inspect the failure.
2. Determine whether it was caused by the current changes.
3. Fix straightforward issues when safe.
4. Re-run validation.

If the failure cannot be safely fixed automatically:

- Do not create the PR.
- Report the exact failure.
- Explain what needs to be fixed.

Do not falsely report successful validation.

---

## 10. Push the Branch

Check remote tracking:

```bash
git branch -vv
```

If the branch is not pushed:

```bash
git push -u origin <current-branch>
```

If it already tracks a remote:

```bash
git push
```

Never force-push unless explicitly requested.

---

## 11. Create PR

Prefer the repository's existing Git hosting tooling.

For GitHub, if GitHub CLI is available:

```bash
gh pr create \
  --base <target-branch> \
  --head <current-branch> \
  --title "<PR title>" \
  --body "<PR description>"
```

Before creating the PR, check whether one already exists:

```bash
gh pr view <current-branch>
```

If a PR already exists, do not create a duplicate.

Instead, report the existing PR.

---

## 12. Generate PR Title

Use the user-provided title when available.

Otherwise derive a concise title from:

1. User request
2. Branch name
3. Commit messages
4. Actual code changes

Examples:

```text
feat: add user profile screen
```

```text
fix: resolve authentication issue
```

```text
chore: add create-pr automation skill
```

---

## 13. Generate PR Description

Generate the description from the actual changes.

Use:

```markdown
## Summary

- <actual change>
- <actual change>

## Testing

- <validation performed>

## Notes

- <important notes, if any>
```

Do not invent functionality.

Do not claim tests were run if they were not run.

---

## 14. Verify PR

After creating the PR, verify:

```bash
gh pr view --web
```

or use the appropriate Git hosting command.

Confirm:

- PR exists
- Correct source branch
- Correct target branch
- Correct title
- Correct changes

---

# Automatic Behavior

The skill should NOT stop for these normal situations:

### Untracked files

Automatically determine whether they belong to the requested work.

### Uncommitted changes

Automatically stage and commit relevant changes.

### Branch not pushed

Automatically push it.

### Missing PR title

Automatically generate one.

### Missing PR description

Automatically generate one.

### Existing remote tracking

Automatically push normally.

### No commits but relevant changes exist

Automatically create a commit.

### Existing PR

Reuse the existing PR instead of creating a duplicate.

---

# Stop Conditions

Stop only when there is a genuine blocker, such as:

- Current branch is the target branch.
- No relevant changes exist.
- Required Git remote is unavailable.
- Authentication is unavailable.
- Secrets are detected.
- Validation fails and cannot safely be fixed.
- Git merge/rebase conflict requires manual resolution.
- Repository configuration prevents PR creation.
- Git hosting CLI/tooling is unavailable and no supported alternative exists.

When stopping, clearly explain:

```text
PR was not created.

Reason:
<actual blocker>

Required action:
<required action>
```

---

# Important Rules

- Work autonomously whenever it is safe.
- Do not ask unnecessary confirmation questions.
- Do not commit unrelated files.
- Do not commit secrets.
- Do not blindly run `git add .`.
- Do not force-push.
- Do not create duplicate PRs.
- Do not invent PR URLs.
- Do not claim validation passed when it did not.
- Follow repository conventions.
- Prefer existing project tooling.
- Do not modify unrelated code.
- Keep commits focused.
- Keep PR descriptions concise.
- Base the PR title and description on actual changes.
- Preserve the user's existing local changes when they are unrelated.
- Never delete unrelated user work.

---

# Expected Output

On success:

```text
PR created successfully.

Title: <PR title>
Source: <source branch>
Target: <target branch>
Commit: <commit hash>

Validation:
- Tests: passed
- Lint: passed
- Type check: passed

PR: <PR URL>
```

If an existing PR is found:

```text
PR already exists.

Title: <PR title>
Source: <source branch>
Target: <target branch>

PR: <PR URL>
```

If blocked:

```text
PR was not created.

Reason:
<actual blocker>

Required action:
<required action>
```
