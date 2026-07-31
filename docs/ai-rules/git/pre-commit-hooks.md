# Pre-commit hooks: never bypass husky + lint-staged

Every commit runs the husky pre-commit hook (`bun run precommit` → `lint-staged`):

- **`prettier --write`** on staged source and docs files (`.svelte`, `.js`, `.ts`, `.json`, `.md`, `.css`, `.html`, `.yml`, and related extensions)
- **`eslint --fix`** on staged `.svelte`, `.js`, `.ts`, `.mjs`, `.cjs`

Whole-repo typecheck (`bun run check`, `bun run check:e2e`) stays in **`make ci`**, not pre-commit — keeps the commit loop fast while CI catches types before push.

Never bypass with `git commit --no-verify`. After clone or `bun install`, `prepare` installs husky hooks automatically. Before pushing, run `make ci` and fix any failures.

## Good

```
git add src/features/auth/stores/authStore.svelte.ts
git commit -m "refactor(ORDUI-3): encapsulate auth feature for FDD phase 3"
# husky runs precommit → lint-staged (prettier + eslint on staged files)

make ci
git push origin ordui-3-encapsulate-auth
```

## Bad

```
git commit --no-verify -m "fix(ORDUI-43): quick fix"   # skips formatter/eslint
git push                                               # without make ci
```
