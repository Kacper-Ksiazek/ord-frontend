# Jira Target

> Single source of truth for this repository. MCP must use **only** this site and project for create/search/update unless user explicitly overrides in chat.

**Target (skrót):** `ORD - UI` (`ORDUI`)  
**Link:** https://kksiazek.atlassian.net/jira/software/projects/ORDUI/boards/1

| Level | Name | ID / Key |
|-------|------|----------|
| Site | kksiazek.atlassian.net | `1a678711-0c91-477f-95d6-f54b7c3df444` |
| Project | ORD - UI | `ORDUI` |

## MCP

Atlassian/Jira MCP is **not** committed in `.cursor/mcp.json` — enable the Atlassian plugin in Cursor (per-developer OAuth).

## Epics (by name — do not hardcode keys)

Issue keys (`ORDUI-*`) change when epics are recreated. Resolve the current key at runtime, e.g.:

`project = ORDUI AND issuetype = Epic AND summary = "FDD Refactor"`

| Epic (summary) | Zakres |
|----------------|--------|
| FDD Refactor | Fazy 1–4 refaktoryzacji FDD |

## jql_scope (optional)

JQL fragment appended to all searches (without leading `AND`). Use `—` for whole project (skip the fragment entirely):

```
—
```

## Rules

- All issue **create** and **search** operations use `cloud_id` and `project_key` above.
- When `jql_scope` is `—`, do not append any scope fragment to JQL.
- When `jql_scope` is a non-empty JQL fragment, append it to searches.
- Do not browse other projects without explicit user instruction.
- If site or project changes in Jira, update this file manually or via skill `jira-setup-project`.
