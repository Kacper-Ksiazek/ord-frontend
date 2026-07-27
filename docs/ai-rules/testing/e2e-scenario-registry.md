# E2E scenario registry

Living documentation for **implemented** Playwright flows. Backlog and phases stay in `docs/e2e-test-plan.md`; this registry is the agent-facing contract for what is actually shipped and green.

## Document split

| Document                     | Role                                                            |
| ---------------------------- | --------------------------------------------------------------- |
| `docs/e2e-test-plan.md`      | Strategic roadmap, infra, tech debt, planned E2E IDs            |
| `e2e/docs/scenarios/`        | **Implemented** scenarios only — user flows, prerequisites, POs |
| Jira subtask (e.g. ORDUI-54) | Approval scope before coding; link plan IDs                     |

Do not copy full scenario tables into `e2e-test-plan.md` for implemented phases — link to the registry instead.

## Layout (mirrors `e2e/flows/`)

```
e2e/docs/scenarios/
├── README.md                    # index + roadmap status per phase
└── <nn-module>/                 # e.g. 01-auth, 04-session
    ├── README.md                # module overview + spec table
    └── <nn-name>.md             # 1 file per <nn-name>.spec.ts
```

- Folder prefix (`01-auth`, `04-session`) = module / roadmap phase — **not** test execution order.
- File prefix (`00-login-happy-path.md`) = sort order within the module — **not** a dependency chain.
- One `###` section per `test()` in the spec (English titles matching the spec).

## Lifecycle

### 1. Propose (before code)

Use the playwright-propose-e2e-scenarios block format (English):

- Feature, Priority, Type, Overview, Prerequisites, Page objects, Duplicate check

Get human approval on which scenarios to implement. **Do not** add registry files for proposals — backlog lives in Jira / `e2e-test-plan.md` until merged.

### 2. Implement (same PR as spec)

- Spec in `e2e/flows/<nn-module>/<nn-name>.spec.ts` — POM only, no selectors in specs.
- Page Objects in the same PR (no stubs for later phases).
- If the flow fails on the real user journey, stop — see `testing/e2e-app-bugs-block-tests.md`.

### 3. Register (same PR, after spec is green)

- Add or update `e2e/docs/scenarios/<nn-module>/<nn-name>.md`.
- Update module `README.md` if new spec file.
- Update root `README.md` index table and roadmap row.

Mark a phase ✅ in the roadmap **only** when every claimed scenario passes without workarounds and matches its Overview (real navigation, no `reload()` bypass, etc.).

### 4. Status values

| Registry / roadmap | Meaning                                                            |
| ------------------ | ------------------------------------------------------------------ |
| ✅ in roadmap      | Phase has specs merged; scenarios in index are green on user paths |
| ⬜ planned         | Backlog — no `.md` scenario file yet                               |
| Partial / deferred | Spec exists but known gap — describe in Notes; **do not** use ✅   |

## Scenario file template

```md
# [Describe block name]

- **Spec:** `e2e/flows/<nn-module>/<nn-name>.spec.ts`
- **Feature:** `auth` | `conversations` | …
- **Module:** `<nn-module>`
- **Plan IDs:** E2E-xxx
- **Status:** implemented

---

### [Test title — same as spec]

- **Feature:** …
- **Priority:** P0 | P1 | P2
- **Type:** happy path | edge case | regression
- **Overview:** User flow and key assertions (real UI path)
- **Prerequisites:** Auth, seed data, env
- **Page objects:** …
- **Duplicate check:** ✅ No overlap | ⚠️ Partial overlap with …
```

## Good

```
# Same PR: spec + PO + scenario doc
e2e/flows/04-session/00-live-session.spec.ts
e2e/pages/conversation-session.page.ts
e2e/docs/scenarios/04-session/00-live-session.md
e2e/docs/scenarios/README.md   # index row added after tests pass

# Resume scenario documents list → row reopen — no reload in Overview or spec
```

## Bad

```
# Scenario doc before spec exists
e2e/docs/scenarios/05-feedback/00-panel.md   # no *.spec.ts yet

# Roadmap ✅ while spec uses reload workaround
| 5 | 04-session/ | … | ✅ |

# Duplicate backlog in two places
docs/e2e-test-plan.md — full step tables for already-implemented auth flows
# instead of: "see e2e/docs/scenarios/01-auth/"

# Registry describes implementation detail instead of user flow
Overview: calls waitForAiMessageContent with 60s timeout
# should describe: user sees AI greeting after opening conversation
```
