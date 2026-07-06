# ClickUp Target

> Single source of truth for this repository. MCP must use **only** `ORD / ui` unless user explicitly overrides in chat.

**Target (skrót):** `ORD / ui`  
**Workspace ID:** `90152136880`  
**Link:** https://app.clickup.com/90152136880/v/l/li/901524175598

| Level | Name | ID |
|-------|------|----|
| Space | ORD | `90158962843` |
| Folder | — | — |
| List | ui | `901524175598` |

`ui` to **lista bez folderu** (folderless) bezpośrednio w space ORD — stąd ścieżka `ORD / ui`.  
W space **ORD** jest też `api` — **ten repo używa wyłącznie `ui`**.

## Rules

- All task **create** and **search** operations use `list_id` above (`901524175598`).
- Do not browse other Spaces/Folders/Lists (np. `api`) without explicit user instruction.
- If hierarchy changes in ClickUp, update this file via `/clickup-setup`.
