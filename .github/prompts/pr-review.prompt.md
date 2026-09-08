---
name: review-pr

description: Review a GitHub Pull Request, identify actionable issues, post review comments, and verify that the review was successfully created.
---

**# Review GitHub Pull Request**

When the user provides a Pull Request number, review the PR, validate GitHub access, post actionable review feedback, and verify the review was successfully created.

**## Workflow**

1. Verify GitHub authentication:

   `gh auth status`

   - If authentication fails, stop.
   - Do not attempt to post a review.

2. Get the authenticated GitHub user:

   `gh api user --jq '.login'`

   - Record the authenticated username.

3. Determine the repository:

   `gh repo view --json nameWithOwner --jq '.nameWithOwner'`

   - Use the actual `OWNER/REPO`.
   - Never use `OWNER/REPO` literally.

4. Verify repository access:

   `gh repo view "<owner>/<repo>"`

   - If this fails, stop.
   - Report `NOT_POSTED`.
   - Include the exact error when available.

5. Verify Pull Request access:

   `gh pr view "<pr-number>" --repo "<owner>/<repo>" --json number,title,state,author,url`

   - If this fails, stop.
   - Report `NOT_POSTED`.

6. Check repository permissions:

   `gh api "repos/<owner>/<repo>" --jq '.permissions'`

   Check:

   - `pull`

   - `triage`

   - `push`

   - `maintain`

   - `admin`

   - If the authenticated user does not have sufficient permissions, stop.

   - Do not attempt to post the review.

7. Get the Pull Request details:

   `gh pr view "<pr-number>" --repo "<owner>/<repo>" --json number,title,body,state,author,baseRefName,headRefName,url`

8. Get the complete PR diff:

   `gh pr diff "<pr-number>" --repo "<owner>/<repo>"`

9. Inspect the changed code and relevant surrounding code.

10. Inspect tests related to the changed code.

11. Check CI status:

`gh pr checks "<pr-number>" --repo "<owner>/<repo>"`

12. Review the PR for:

- Correctness
- Security
- Reliability
- Performance
- API/contract changes
- Data/database issues
- Testing
- Maintainability

13. Only report evidence-based findings.

Each finding must include:

- Severity
- Category
- File
- Line/location
- Problem
- Why it matters
- Recommended fix

14. Use these severity levels:

- `CRITICAL`
- `HIGH`
- `MEDIUM`
- `LOW`
- `SUGGESTION`

15. Do not report:

- Purely subjective style preferences
- Formatting issues
- Speculative bugs
- Issues unrelated to the PR
- Test failures without evidence
- Duplicate findings

16. Prepare the review:

`## PR Review`

`### Summary`

`<summary>`

`### Findings`

`<findings grouped by severity>`

`### Tests`

`<test results>`

`### CI`

`<CI results>`

`### Positive Observations`

`<positive observations>`

`### Recommendation`

`<recommendation>`

- Omit empty sections.

17. Post the review only after all preflight checks pass:

`gh api -X POST -H "Accept: application/vnd.github+json" "/repos/<owner>/<repo>/pulls/<pr-number>/reviews" -f body="<review-body>" -f event="COMMENT"`

18. Verify that GitHub created the review:

`gh api "/repos/<owner>/<repo>/pulls/<pr-number>/reviews"`

- Confirm the newly created review exists.
- Record the review ID.
- Do not claim success without verification.

19. If the review is successfully created, report:

`✅ Review posted successfully`

`Repository: <owner>/<repo>`

`PR: #<pr-number>`

`Review ID: <review-id>`

`Status: POSTED`

20. If posting fails, report:

`❌ Review was not posted`

`Repository: <owner>/<repo>`

`PR: #<pr-number>`

`Account: <username>`

`Status: NOT_POSTED`

`Reason: <exact GitHub error>`

- Do not hide or replace the original GitHub error.
- Do not claim that the review was posted.

**## Rules**

- The user should only need to provide the PR number when working inside the target repository.
- Always verify GitHub authentication before reviewing.
- Always verify repository and PR access before posting.
- Always use the actual repository name.
- Never use `OWNER/REPO` literally.
- Never post a review if preflight checks fail.
- Never claim a review was posted without verifying it.
- Preserve the exact GitHub error when posting fails.
- Review the PR diff first.
- Inspect surrounding code when necessary.
- Prioritize correctness, security, reliability, and meaningful performance issues.
- Avoid false positives.
- Do not modify source code during the review.
- Do not merge the PR.
- Do not approve the PR unless explicitly requested.
- Do not commit, push, reset, stash, or modify the user's working tree.
- Use the available terminal/shell tool to execute the commands.
- Clearly distinguish between `PRECHECK FAILED`, `POST FAILED`, and `POSTED`.

**## Example**

User: `Review PR 1`

Execute:

`gh auth status`

`gh api user --jq '.login'`

`gh repo view --json nameWithOwner --jq '.nameWithOwner'`

`gh repo view "<owner>/<repo>"`

`gh pr view 2 --repo "<owner>/<repo>" --json number,title,state,author,url`

`gh api "repos/<owner>/<repo>" --jq '.permissions'`

`gh pr diff 2 --repo "<owner>/<repo>"`

`gh pr checks 2 --repo "<owner>/<repo>"`

Review the changes.

Post the review.

Verify the review exists.

Then report:

`✅ Review posted successfully`

`Status: POSTED`
