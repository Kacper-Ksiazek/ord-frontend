# Branch & PR workflow: one branch and PR per Jira subtask

Name branches `ordui-N-short-slug` (lowercase Jira key plus a short kebab-case slug). Do one PR per Jira subtask, merged into `main` via a GitHub PR using a merge commit (never push directly to `main`). The PR body has two sections: `## Summary` and `## Test plan`.

PRs to `main` must pass CI checks including **`e2e`** (Playwright against pinned `ord-api` GHCR image). Enable required checks per [`.github/REQUIRED_CHECKS.md`](../../.github/REQUIRED_CHECKS.md). When changing user flows or auth/conversations UI, mention E2E impact in the test plan (`bun run test:e2e` locally or rely on the `e2e` job).

## Good

```
git checkout -b ordui-47-unify-feature-structure
# ... commits ...
gh pr create --base main --title "refactor(ORDUI-47): unify feature structure and API conventions" --body "## Summary
- Unify feature folder structure across features/*
- Align API caller naming conventions

## Test plan
- bun run check, bun run lint, bun run test all pass
- bun run test:e2e (auth smoke) with ord-api docker-compose.e2e stack
- Manually verified conversations and auth flows"
```

## Bad

```
git checkout -b my-fixes            # no Jira key, no slug convention
git push origin my-fixes:main       # direct push to main, no PR
# PR body: "misc changes"           # no Summary / Test plan sections
```
