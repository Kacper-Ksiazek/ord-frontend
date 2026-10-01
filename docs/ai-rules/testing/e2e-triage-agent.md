# Dedicated E2E triage agent

Playwright journey work uses a **separate triage agent** so the implementation agent does not spend hours “fixing tests” when the **app, API stub, or stack** is broken.

## When to invoke

| Trigger | Who invokes |
|---------|-------------|
| 1st or 2nd failure on the same journey goal | **Main agent** (mandatory before editing `e2e/journeys/*`) |
| User says “triage E2E”, “why did this fail”, pastes `error-context.md` | **User** or main agent |
| CI `e2e` job red on PR | Optional: human runs triage locally with same failure |

## How to invoke (Cursor)

### Option A — User

In chat: **“Run E2E triage”** and attach the failure (log, step name, or `@test-results/.../error-context.md`). Ask the agent to follow **`.cursor/skills/e2e-triage/SKILL.md`**.

### Option B — Main agent (required on 1st/2nd fail)

Spawn **one** subagent via the **Task** tool:

- **subagent_type:** `generalPurpose`
- **model:** `inherit`
- **run_in_background:** `false`
- **description:** use the template below (fill brackets).

Do **not** edit journey specs until the triage report returns and the user confirms manual check (or explicitly overrides).

#### Task description template

```text
E2E triage (ord-frontend). Follow .cursor/skills/e2e-triage/SKILL.md exactly.

Repository: /Users/kacperksiazek/workspace/ord-frontend (or current workspace root).

Failure #: [1 | 2 | 3+]
Command: [e.g. make test-e2e ARGS='journeys/05-explain-phrase-journey.spec.ts']
Journey file: [e2e/journeys/….spec.ts]
Failed test.step: [NN. label if known]

Error excerpt:
[paste terminal / error-context.md]

Context: [what we were trying to ship; ord-api image pin changed? y/n]

Output the triage report only. No code changes.
```

## Relationship to other docs

| Doc | Role |
|-----|------|
| [`e2e-failure-triage-manual-first.md`](e2e-failure-triage-manual-first.md) | Policy: manual check on 1st/2nd fail |
| [`e2e-app-bugs-block-tests.md`](e2e-app-bugs-block-tests.md) | No workarounds in specs |
| [`e2e-run-artifacts-hygiene.md`](e2e-run-artifacts-hygiene.md) | Clean `test-results` after runs |
| `.cursor/skills/e2e-triage/SKILL.md` | **Triage agent** operating manual |
| `.cursor/rules/e2e-journey-agent.mdc` | Main agent: delegate + hygiene |

## Good workflow

```
Journey fails → Task (e2e-triage skill) → report: app-bug, spec edits blocked
→ Human reproduces in browser → confirms bug → feature agent fixes app
→ Journey re-run green → make test-e2e-clean
```

## Bad workflow

```
Journey fails → six commits to waits/selectors/SSE body reads → never opened the modal manually
```
