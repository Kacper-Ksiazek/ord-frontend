# Pre-commit hooks: never bypass husky + lint-staged

Every commit runs the husky pre-commit hook (`bun run lint-staged`), which applies `prettier --write` to staged files (`.svelte`, `.js`, `.ts`, `.json`, `.md`, `.css`, `.html`, `.yml`, and related extensions). ESLint runs in CI via `make ci`, not on pre-commit. Never bypass the hook with `git commit --no-verify`. After clone or `bun install`, `prepare` installs husky hooks automatically. Before pushing, run `make ci` and fix any failures.

## Good

```
git add src/features/auth/stores/authStore.svelte.ts
git commit -m "refactor(ORDUI-3): encapsulate auth feature for FDD phase 3"
# husky runs lint-staged: prettier --write on staged files

make ci
git push origin ordui-3-encapsulate-auth
```

## Bad

```
git commit --no-verify -m "fix(ORDUI-43): quick fix"   # skips formatter
git push                                               # without make ci
```
