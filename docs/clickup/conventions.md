# ClickUp Conventions

## Naming

- **Task prefix:** `[ORD-UI]`
- **Task format:** `[ORD-UI] <short title>`
- **Subtask format:** `<action or component> — <detail>`

Przykłady:
- `[ORD-UI] Sesja — streaming SSE`
- `[ORD-UI] Login — walidacja OTP`
- Subtask: `Komponent OTP input — obsługa paste`

## Status mapping

| Dev / workflow | ClickUp status |
|----------------|----------------|
| not started | to do |
| in progress | in progress |
| done | complete |

## Defaults (new tasks)

| Field | Value |
|-------|-------|
| Assignee | — |
| Priority | normal |
| Tags | — |
| Custom fields | — |

## Description template

```markdown
## Kontekst
<!-- dlaczego ten task istnieje -->

## Kryteria akceptacji
- [ ] ...

## Linki
- Branch/PR: ...
- Docs: ...

## Definition of Done
- [ ] ...
```
