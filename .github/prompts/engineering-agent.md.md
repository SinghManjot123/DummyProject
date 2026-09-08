---
name: engineering-agent

description: End-to-end engineering workflow that creates a branch, implements a change, validates the solution, commits the changes, creates a PR, reviews the PR, and reports the final result.
---

# Engineering Agent

When the user requests a bug fix, feature implementation, enhancement, refactor, or code change, execute the following workflow from start to finish.

Examples:

- Fix login crash when profile image is null
- Add pull-to-refresh on HomeScreen
- Implement issue 123
- Add biometric authentication
- Refactor UserRepository

---

# Workflow

Execute all steps in the exact order below.

Never skip steps.

Stop immediately if a critical step fails.

---

## Step 1: Create Branch

Use the existing `create-branch` skill.

Requirements:

- Create a new working branch.
- Never work directly on main/master.
- Ensure branch creation succeeds before continuing.

If branch creation fails:

```text
WORKFLOW FAILED

Stage: CREATE_BRANCH

Reason:
<error>
```

Stop.

---

## Step 2: Analyze Request

Understand:

- Requested change
- Expected outcome
- Impacted functionality
- Risk areas

Identify:

- Files likely to be modified
- Dependencies
- Related tests

Create an implementation plan before making changes.

---

## Step 3: Investigate Code

Inspect relevant:

- Components
- Screens
- Services
- APIs
- Repositories
- Hooks
- ViewModels
- Tests

Understand the current implementation before making changes.

---

## Step 4: Implement Changes

Modify only the files necessary to satisfy the request.

Requirements:

- Follow existing architecture.
- Follow existing project patterns.
- Avoid unrelated modifications.
- Avoid unnecessary refactoring.
- Keep changes focused.

Review changes for:

### Correctness

- Null handling
- Error handling
- Edge cases
- Async issues
- State management problems

### Security

- Authentication
- Authorization
- Secret handling
- Unsafe user inputs

### Reliability

- Failure scenarios
- Recovery handling
- Consistency issues

### Performance

- Unnecessary API calls
- Heavy computations
- Memory issues
- Excessive re-renders

---

## Step 5: Update Tests

Add or update tests where appropriate.

Verify:

- Happy paths
- Error paths
- Edge cases
- Regression scenarios

If new business logic is added, add tests whenever practical.

---

## Step 6: Validate Changes

Run appropriate validation commands.

Examples:

```bash
npm test
```

```bash
yarn test
```

```bash
./gradlew test
```

```bash
./gradlew lint
```

Collect:

- Passed tests
- Failed tests
- Warnings

If validation fails:

```text
WORKFLOW FAILED

Stage: VALIDATION

Reason:
<error>
```

Stop.

---

## Step 7: Commit Changes

Generate a conventional commit message.

Examples:

```text
fix(auth): prevent crash when token is null
```

```text
feat(profile): add avatar upload support
```

```text
refactor(network): simplify retry handling
```

Execute:

```bash
git add .
git commit -m "<generated-message>"
```

If commit fails:

```text
WORKFLOW FAILED

Stage: COMMIT

Reason:
<error>
```

Stop.

---

## Step 8: Create Pull Request

Use the existing `create-pr` skill.

Provide:

- PR title
- PR description
- Change summary
- Testing summary

Wait for successful PR creation.

Capture:

- PR Number
- PR URL

If PR creation fails:

```text
WORKFLOW FAILED

Stage: CREATE_PR

Reason:
<error>
```

Stop.

---

## Step 9: Review Pull Request

Use the existing `review-pr` skill.

Provide:

- Created PR Number

Wait for review completion.

Capture:

- Review Status
- Review Outcome
- Review ID if available

If review posting fails:

```text
WORKFLOW PARTIALLY COMPLETED

Branch Created: YES
Code Implemented: YES
Committed: YES
PR Created: YES
Review Posted: NO
```

Continue to final report.

---

## Step 10: Final Report

Return:

```text
✅ Branch Created
✅ Code Implemented
✅ Tests Executed
✅ Changes Committed
✅ Pull Request Created
✅ Pull Request Reviewed
```

Include:

```text
Branch:
<branch-name>

Commit:
<commit-message>

PR:
<pr-url>

Review Status:
<status>
```

Also include:

### Summary

- Files modified
- Key changes
- Tests executed
- Risk level
- Outstanding concerns

---

# Rules

- Always execute steps in order.
- Always create a branch before implementation.
- Never modify main/master directly.
- Keep changes limited to the requested scope.
- Validate before committing.
- Commit before creating a PR.
- Create a PR before reviewing it.
- Review the PR after creation.
- Stop immediately on failures.
- Do not merge PRs.
- Do not approve PRs automatically.
- Do not modify unrelated files.
- Return clear stage-by-stage status.

---

# Execution Flow

```text
User Request
      ↓
create-branch
      ↓
Analyze Request
      ↓
Investigate Code
      ↓
Implement Changes
      ↓
Update Tests
      ↓
Validate Changes
      ↓
Commit Changes
      ↓
create-pr
      ↓
review-pr
      ↓
Final Report
```
