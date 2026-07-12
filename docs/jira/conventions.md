# Jira Conventions

## Naming

- **Summary prefix:** `[ORD-UI]` — tylko dla pracy **poza** epicami (np. bugi, one-off)
- **Issue format:** `[ORD-UI] <short title>` lub `<short title>` gdy issue jest w epicu
- **Sub-task format:** `<action or component> — <detail>`

### Epic: FDD Refactor (`ORDUI-23`)

Praca refaktoryzacyjna FDD grupowana w epicu **FDD Refactor** — bez prefiksu `[ARCH]`:

| Poziom | Format | Przykład |
|--------|--------|----------|
| Epic | `FDD Refactor` | `ORDUI-23` |
| Faza (Task) | `Faza N — <cel>` | `Faza 1 — granice $lib/components` |
| Subtask | `<akcja> — <szczegół>` | `Napraw odwróconą zależność scores → conversations` |

Przykłady poza epicem:
- `[ORD-UI] Sesja — streaming SSE`
- `[ORD-UI] Login — walidacja OTP`

## Issue types

| Use case | Issue type name |
|----------|-----------------|
| Default new work | Task |
| Bug | Bug |
| Feature / story | Story |
| Sub-task | Subtask |

## Status mapping

| Dev / workflow | Jira status | Notes |
|----------------|-------------|-------|
| not started | To Do | |
| in progress | In Progress | |
| review | In Progress | brak osobnego statusu review na boardzie |
| done | Done | |
| cancelled | Done | zamknij z odpowiednią resolution / komentarzem |

## Defaults (new issues)

| Field | Value |
|-------|-------|
| Assignee | — |
| Priority | Medium |
| Labels | — |
| Components | — |
| Custom fields | — |

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
