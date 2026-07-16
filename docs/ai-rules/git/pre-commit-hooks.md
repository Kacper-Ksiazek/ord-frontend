# Pre-commit hooks: never bypass husky + lint-staged

Every commit runs the husky pre-commit hook (`bun run lint-staged`), which applies `prettier --write` and `eslint --fix` to staged `.svelte`, `.js`, `.ts` files and `prettier --write` to `.json`. Never bypass it with `git commit --no-verify`. Before pushing, run `bun run check`, `bun run lint`, and `bun run test` and make sure they pass.

## Good

```
git add src/features/auth/stores/authStore.svelte.ts
git commit -m "refactor(ORDUI-3): encapsulate auth feature for FDD phase 3"
# husky runs lint-staged: prettier + eslint --fix on staged files

bun run check && bun run lint && bun run test
git push origin ordui-3-encapsulate-auth
```

## Bad

```
git commit --no-verify -m "fix(ORDUI-43): quick fix"   # skips prettier/eslint
git push                                               # without check/lint/test
```
