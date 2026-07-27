# E2E scenario registry

Living documentation for **implemented** Playwright flows. Backlog and phases stay in `docs/e2e-test-plan.md`; this registry is the agent-facing contract for what is actually shipped and green.

## Document split

| Document                     | Role                                                            |
| ---------------------------- | --------------------------------------------------------------- |
| `docs/e2e-test-plan.md`      | Strategic roadmap, infra, tech debt, planned E2E IDs            |
| `e2e/docs/scenarios/`        | **Implemented** scenarios only — user flows, prerequisites, POs |
| Jira subtask (e.g. ORDUI-54) | Approval scope before coding; link plan IDs                     |

Do not copy full scenario tables into `e2e-test-plan.md` for implemented phases — link to the registry instead.

## Layout (mirrors `e2e/features/`)

```
e2e/docs/scenarios/
├── README.md                    # index + roadmap status per phase
└── <feature>/                   # e.g. auth, conversations/list, conversations/session
    ├── README.md                # module overview + spec table
    └── <nn-name>.md             # 1 file per <nn-name>.spec.ts
```

- Folder names follow **FDD features** (`auth`, `conversations/list`, …) — not numeric prefixes.
- File prefix (`00-login-happy-path.md`) = sort order within the module — **not** a dependency chain.
- One `###` section per `test()` in the spec (English titles matching the spec).

## Lifecycle

### 1. Propose (before code)

Use the playwright-propose-e2e-scenarios block format (English):

- Feature, Priority, Type, Overview, Prerequisites, Page objects, Duplicate check

Get human approval on which scenarios to implement. **Do not** add registry files for proposals — backlog lives in Jira / `e2e-test-plan.md` until merged.

### 2. Implement (same PR as spec)

- Spec in `e2e/features/<feature>/…/flows/<nn-name>.spec.ts` — POM only, no selectors in specs.
- Page Objects in the same feature module (no stubs for later phases).
- If the flow fails on the real user journey, stop — see `testing/e2e-app-bugs-block-tests.md`.

### 3. Register (same PR, after spec is green)

- Add or update `e2e/docs/scenarios/<feature>/…/<nn-name>.md`.
- Update module `README.md` if new spec file.
- Update root `README.md` index table and roadmap row.

Mark a phase ✅ in the roadmap **only** when every claimed scenario passes without workarounds and matches its Overview (real navigation, no `reload()` bypass, etc.).

### 4. Status values

| Registry / roadmap | Meaning                                                            |
| ------------------ | ------------------------------------------------------------------ |
| ✅ in roadmap      | Phase has specs merged; scenarios in index are green on user paths |
| ⬜ planned         | Backlog — no `.md` scenario file yet                               |
| Partial / deferred | Spec exists but known gap — describe in Notes; **do not** use ✅   |

## Scenario doc template

```md
### [Test title from spec]

- **Spec:** `e2e/features/<feature>/…/flows/<nn-name>.spec.ts`
- **Feature:** `auth` | `conversations/list` | …
- **Priority:** P0 | P1 | P2
- **Type:** happy path | edge case | regression
- **Overview:** User flow and key assertions
- **Prerequisites:** Auth, seed data, env vars
- **Page objects:** Existing or new POs (feature module paths)
- **Duplicate check:** ✅ No overlap | ⚠️ Partial overlap with …
```

## Good PR file set

```
e2e/features/conversations/session/flows/00-live-session.spec.ts
e2e/features/conversations/session/pages/conversation-session.page.ts
e2e/docs/scenarios/conversations/session/00-live-session.md
e2e/docs/scenarios/README.md   # index row added after tests pass
```

## Bad

```
e2e/docs/scenarios/05-feedback/00-panel.md   # no *.spec.ts yet
docs/e2e-test-plan.md                          # duplicating full scenario tables for shipped phases
```
