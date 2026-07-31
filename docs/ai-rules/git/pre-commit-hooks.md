# Pre-commit hooks: never bypass husky + lint-staged

Every commit runs the husky pre-commit hook (`bun run precommit`):

1. **lint-staged** — `prettier --write` on staged source/docs files; `eslint --fix` on staged `.svelte`, `.js`, `.ts`, `.mjs`, `.cjs`
2. **`bun run check`** — Svelte/TS typecheck (`svelte-check`, via `precheck` → aggregate + paraglide)
3. **`bun run check:e2e`** — Playwright E2E TS project (`tsc -p e2e/tsconfig.json`)

Never bypass with `git commit --no-verify`. After clone or `bun install`, `prepare` installs husky hooks automatically. Before pushing, run `make ci` and fix any failures.

## Good

```
git add src/features/auth/stores/authStore.svelte.ts
git commit -m "refactor(ORDUI-3): encapsulate auth feature for FDD phase 3"
# husky runs precommit: lint-staged → check → check:e2e

make ci
git push origin ordui-3-encapsulate-auth
```

## Bad

```
git commit --no-verify -m "fix(ORDUI-43): quick fix"   # skips formatter, eslint, types
git push                                               # without make ci
```
