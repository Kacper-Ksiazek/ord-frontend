# E2E scenario registry

Living documentation for **implemented** Playwright flows. Backlog and phases stay in `docs/e2e-test-plan.md`; this registry is the agent-facing contract for what is actually shipped and green.

## Document split

| Document                     | Role                                                        |
| ---------------------------- | ----------------------------------------------------------- |
| `docs/e2e-test-plan.md`      | Strategic roadmap, infra, tech debt, planned E2E IDs        |
| `e2e/docs/scenarios/`        | **Implemented** specs — compact cards (one per `*.spec.ts`) |
| Jira subtask (e.g. ORDUI-54) | Approval scope before coding; link plan IDs                 |

Do not copy full scenario tables into `e2e-test-plan.md` for implemented phases — link to the registry instead.

## Layout (mirrors `e2e/features/`)

```
e2e/docs/scenarios/
├── README.md                    # index (per spec) + roadmap
└── <feature>/                   # e.g. auth, conversations/list
    └── <nn-name>.md             # compact card for <nn-name>.spec.ts
```

- Folder names follow **FDD features** — not numeric prefixes.
- File prefix (`00-login-happy-path.md`) = sort order — **not** a dependency chain.
- **One file per spec**; tests inside as a table row each (title = `test()` name).

## Lifecycle

### 1. Propose (before code)

Use the playwright-propose-e2e-scenarios block format (English) in **Jira or chat only**:

- Feature, Priority, Type, Overview, Prerequisites, Page objects, Duplicate check

Do **not** add registry files for proposals — backlog lives in Jira / `e2e-test-plan.md` until merged.

### 2. Implement (same PR as spec)

- Spec in `e2e/features/<feature>/…/flows/<nn-name>.spec.ts` — POM only, no selectors in specs.
- Page Objects in the same feature module (no stubs for later phases).
- If the flow fails on the real user journey, stop — see `testing/e2e-app-bugs-block-tests.md`.

### 3. Register (same PR, after spec is green)

- Add or update `e2e/docs/scenarios/<feature>/…/<nn-name>.md` (compact card).
- Add one row to `e2e/docs/scenarios/README.md` **Implemented specs** table.
- Update roadmap row when the phase is fully green.

Mark a phase ✅ in the roadmap **only** when every claimed scenario passes without workarounds and matches its Overview (real navigation, no `reload()` bypass, etc.).

### 4. Status values

| Registry / roadmap | Meaning                                                            |
| ------------------ | ------------------------------------------------------------------ |
| ✅ in roadmap      | Phase has specs merged; scenarios in index are green on user paths |
| ⬜ planned         | Backlog — no `.md` card yet                                        |
| Partial / deferred | Spec exists but known gap — describe in card **Notes**; no ✅      |

## Compact spec card template

Metadata **once per file**. Omit fields that match module defaults (e.g. skip `Requires` when auth env + backend is standard for conversations).

```md
# [Human title]

**Spec:** `e2e/features/<feature>/…/flows/<nn-name>.spec.ts`
**Plan:** E2E-xxx · **Priority:** P0 · **Fixture:** `authenticatedPage`

**Requires:** only when non-default
**PO:** only when non-obvious from spec imports

| Test                     | Overview                           |
| ------------------------ | ---------------------------------- |
| [test() title from spec] | One-line user flow + key assertion |

**Notes:** non-obvious traps only (OTP, SSE, timeouts, index rules). Use ⚠️ in Overview or Notes for overlap warnings.
```

**Do not include in cards:** `Status: implemented`, legacy module ids (`01-auth`), per-test `Feature`, `Duplicate check: ✅ No overlap`.

## Good PR file set

```
e2e/features/conversations/session/flows/00-live-session.spec.ts
e2e/features/conversations/session/pages/conversation-session.page.ts
e2e/docs/scenarios/conversations/session/00-live-session.md
e2e/docs/scenarios/README.md   # one new index row
```

## Bad

```
e2e/docs/scenarios/05-feedback/00-panel.md   # no *.spec.ts yet
Per-test ### blocks with 8 repeated bullet fields each
docs/e2e-test-plan.md                          # duplicating full scenario tables for shipped phases
```
