# Commit messages: conventional-commit style with Jira key

Write commit messages as `type(ORDUI-N): summary` — type is one of `feat`, `fix`, `refactor`, `chore` (also `docs` for docs-only changes), the scope is the Jira issue key, and the summary is a short, lowercase, imperative sentence. An optional body line may add context; keep the subject under ~72 characters.

## Good

```
refactor(ORDUI-46): thin routes behind feature page barrels
```

```
chore(ORDUI-48): remove dead code and align naming conventions
```

## Bad

```
Fixed some stuff in the routes.

(no type, no Jira key, past tense, capitalized)
```

```
ORDUI-46 thin routes

(missing conventional-commit type and colon format)
```
