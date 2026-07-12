# Jira Target

> Single source of truth for this repository. MCP must use **only** this site and project for create/search/update unless user explicitly overrides in chat.

**Target (skrót):** `ORD - UI` (`ORDUI`)  
**Link:** https://kksiazek.atlassian.net/jira/software/projects/ORDUI/boards/1

| Level | Name | ID / Key |
|-------|------|----------|
| Site | kksiazek.atlassian.net | `1a678711-0c91-477f-95d6-f54b7c3df444` |
| Project | ORD - UI | `ORDUI` |

## Epics

| Epic | Key | Zakres |
|------|-----|--------|
| FDD Refactor | `ORDUI-23` | Fazy 1–4 refaktoryzacji FDD (taski bez prefiksu `[ARCH]`) |

## Scope (optional)

JQL fragment appended to all searches (without leading `AND`), or `—` for whole project:

```
—
```

## Rules

- All issue **create** and **search** operations use `cloud_id` and `project_key` above.
- Apply `jql_scope` when searching; do not browse other projects without explicit user instruction.
- If site or project changes in Jira, update this file via `/jira-setup`.
