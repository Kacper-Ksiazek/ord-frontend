# E2E run artifacts: never commit, clean up when done

Playwright and the IDE create **local-only** files. They are not part of the product and must not accumulate in the repo.

## Where artifacts belong

| Path | Source | In git? |
|------|--------|--------|
| `e2e/test-results/` | Playwright `outputDir` (traces, screenshots, video) | No — `.gitignore` |
| `e2e/playwright-report/` | HTML report | No |
| `test-results/` (repo root) | IDE / Playwright run from wrong cwd | No — add to `.gitignore`, delete |
| `test-results/**/error-context.md` | IDE helper for AI on failure | Never commit |
| `test-results/.last-run.json` | IDE last-run metadata | Never commit |

Official clean command: `make test-e2e-clean` (removes `e2e/test-results` and `e2e/playwright-report`).

## Agent duties

1. **Never** `git add` anything under `test-results/`, `e2e/test-results/`, or `e2e/playwright-report/`.
2. After E2E work is **done and tests pass** (or the user ends the task), **remove stray artifacts**:
   - Run `make test-e2e-clean` when journeys were executed.
   - Delete repo-root `test-results/` if present (`rm -rf test-results`).
3. Do not leave `error-context.md` or `.last-run.json` for the user to commit by mistake.
4. Do not add these paths to the repo “for debugging” — use CI artifacts or local-only folders.

## Good

```bash
make test-e2e ARGS='journeys/05-explain-phrase-journey.spec.ts'
# … fix verified …
make test-e2e-clean
rm -rf test-results   # if IDE created root folder
```

## Bad

```bash
git add test-results/e2e-journeys-05-.../error-context.md
# or leaving root test-results/ untracked forever in the working tree without telling the user
```
