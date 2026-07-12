# Jira Conventions

## Naming

- **Summary prefix:** `[ORD-UI]` — tylko dla pracy **poza** epicami (np. bugi, one-off)
- **Issue format:** `[ORD-UI] <short title>` lub `<short title>` gdy issue jest w epicu
- **Subtask format:** `<action or component> — <detail>`

### Praca w epicu FDD Refactor

Grupowanie przez epic **FDD Refactor** (szukaj klucza po `summary` — patrz `docs/jira/target.md`). W summary issue **nie** używaj prefiksu `[ORD-UI]`:

| Poziom | Format | Przykład |
|--------|--------|----------|
| Epic | `FDD Refactor` | (nazwa epica) |
| Faza (Task) | `Faza N — <cel>` | `Faza 1 — granice $lib/components` |
| Subtask | `<akcja> — <szczegół>` | `Napraw odwróconą zależność scores → conversations` |

Przykłady poza epicem:
- `[ORD-UI] Sesja — streaming SSE`
- `[ORD-UI] Login — walidacja OTP`

## Issue types

| Use case | Issue type name (ORDUI) |
|----------|-------------------------|
| Default new work | Task |
| Bug | Bug |
| Feature / story | Story |
| Subtask | Subtask |

## Status mapping

| Dev / workflow | Jira status | Notes |
|----------------|-------------|-------|
| not started | To Do | |
| in progress | In Progress | |
| review | In Progress | brak osobnego statusu review na boardzie |
| done | Done | resolution: Done |
| cancelled | Done | resolution: Done + komentarz `cancelled` / `won't do` (next-gen ORDUI nie ma osobnego statusu) |

## Defaults (new issues)

| Field | Value |
|-------|-------|
| Priority | Medium |

## Description template

```markdown
## Kontekst
<!-- dlaczego ten issue istnieje -->

## Kryteria akceptacji
- [ ] ...

## Linki
- Branch/PR: ...
- Docs: ...

## Definition of Done
- [ ] ...
```
