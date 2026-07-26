# E2E scenario registry

Living register of **implemented** Playwright E2E user flows. Specs live in `e2e/flows/`; this folder mirrors that layout with human-readable descriptions.

| Document                                                                                                          | Purpose                                       |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| This file                                                                                                         | Index, roadmap, how to add scenarios          |
| [`docs/e2e-test-plan.md`](../../../docs/e2e-test-plan.md)                                                         | Strategic plan, infra, tech debt, backlog IDs |
| [`docs/ai-rules/testing/e2e-tests-playwright.md`](../../../docs/ai-rules/testing/e2e-tests-playwright.md)         | POM conventions for agents                    |
| [`docs/ai-rules/testing/e2e-scenario-registry.md`](../../../docs/ai-rules/testing/e2e-scenario-registry.md)       | Scenario docs lifecycle and status rules      |
| [`docs/ai-rules/testing/e2e-app-bugs-block-tests.md`](../../../docs/ai-rules/testing/e2e-app-bugs-block-tests.md) | App bugs block specs — notify developer first |

## Implemented scenarios (13 tests)

| ID      | Module                               | Scenario                                | Spec                                  | Doc                                           |
| ------- | ------------------------------------ | --------------------------------------- | ------------------------------------- | --------------------------------------------- |
| E2E-101 | [auth](./01-auth/)                   | Redirect → login → conversations        | `01-auth/00-login-happy-path`         | [→](./01-auth/00-login-happy-path.md)         |
| E2E-101 | [auth](./01-auth/)                   | Sidebar shows user email after login    | `01-auth/00-login-happy-path`         | [→](./01-auth/00-login-happy-path.md)         |
| E2E-102 | [auth](./01-auth/)                   | Email validation — no `@`               | `01-auth/01-login-validation-errors`  | [→](./01-auth/01-login-validation-errors.md)  |
| E2E-102 | [auth](./01-auth/)                   | Email validation — empty field          | `01-auth/01-login-validation-errors`  | [→](./01-auth/01-login-validation-errors.md)  |
| E2E-103 | [auth](./01-auth/)                   | Session survives reload                 | `01-auth/02-session-persistence`      | [→](./01-auth/02-session-persistence.md)      |
| E2E-103 | [auth](./01-auth/)                   | Session restored in new browser context | `01-auth/02-session-persistence`      | [→](./01-auth/02-session-persistence.md)      |
| E2E-104 | [auth](./01-auth/)                   | Logout clears session                   | `01-auth/03-logout`                   | [→](./01-auth/03-logout.md)                   |
| E2E-201 | [conversations](./02-conversations/) | List loads with filters and rows        | `02-conversations/00-list-navigation` | [→](./02-conversations/00-list-navigation.md) |
| E2E-201 | [conversations](./02-conversations/) | New conversation button → create flow   | `02-conversations/00-list-navigation` | [→](./02-conversations/00-list-navigation.md) |
| E2E-201 | [conversations](./02-conversations/) | Row click → session page                | `02-conversations/00-list-navigation` | [→](./02-conversations/00-list-navigation.md) |
| E2E-301 | [create](./03-create/)               | Full happy path → new session           | `03-create/00-create-conversation`    | [→](./03-create/00-create-conversation.md)    |
| E2E-303 | [create](./03-create/)               | Step validation blocks advance          | `03-create/00-create-conversation`    | [→](./03-create/00-create-conversation.md)    |
| E2E-303 | [create](./03-create/)               | Back navigation preserves selections    | `03-create/00-create-conversation`    | [→](./03-create/00-create-conversation.md)    |

## Roadmap

Phases align with [`docs/e2e-test-plan.md`](../../../docs/e2e-test-plan.md). New scenario docs appear here **when the spec is merged** — not before.

| Phase | Module folder       | Scope                           | Plan IDs             | Status                           |
| ----- | ------------------- | ------------------------------- | -------------------- | -------------------------------- |
| 0     | —                   | Playwright infra, fixtures, CI  | E2E-000–011          | ✅ done                          |
| 1     | `01-auth/`          | OTP login, session, logout      | E2E-101–104          | ✅ [4 specs](./01-auth/)         |
| 2     | —                   | `data-testid` in app            | E2E-110              | ✅ done                          |
| 3     | `02-conversations/` | List load and navigation        | E2E-201              | ✅ [1 spec](./02-conversations/) |
| 4     | `03-create/`        | Create flow (4 steps)           | E2E-301, E2E-303     | ✅ [1 spec](./03-create/)        |
| 5     | `04-session/`       | Live chat, SSE, messaging       | E2E-401–404, E2E-006 | ⬜ planned                       |
| 6     | `05-feedback/`      | Feedback panel flows            | E2E-501–504          | ⬜ **next**                      |
| 7     | `06-filters/`       | List filters, AI topics         | E2E-202, E2E-302     | ⬜ planned                       |
| 8     | `07-tts/`           | Text-to-speech                  | E2E-601              | ⬜ planned                       |
| 9     | `08-chrome/`        | Activity heatmap, theme, locale | E2E-203, E2E-701–702 | ⬜ planned                       |

## Directory layout

```
e2e/docs/scenarios/
├── README.md                 # this file — index + roadmap
└── <nn-module>/              # mirrors e2e/flows/<nn-module>/
    ├── README.md             # module overview
    └── <nn-name>.md          # 1 file per *.spec.ts
```

## Adding a scenario

Follow [`docs/ai-rules/testing/e2e-scenario-registry.md`](../../../docs/ai-rules/testing/e2e-scenario-registry.md). Summary:

1. Propose the flow (feature, priority, prerequisites) — playwright-propose-e2e-scenarios skill format; human approval first.
2. Implement spec in `e2e/flows/<nn-module>/<nn-name>.spec.ts` with Page Objects — fix app bugs before encoding workarounds.
3. Add or update `<nn-name>.md` in the matching folder (one `###` section per `test()`).
4. Update this README index table and roadmap row when the spec is green on the real user path.
5. Link plan IDs from `docs/e2e-test-plan.md` when applicable.

Scenario block template:

```md
### [Test title from spec]

- **Feature:** `auth` | `conversations` | …
- **Priority:** P0 | P1 | P2
- **Type:** happy path | edge case | regression
- **Overview:** User flow and key assertions
- **Prerequisites:** Auth, seed data, env vars
- **Page objects:** Existing or new POs
- **Duplicate check:** ✅ No overlap | ⚠️ Partial overlap with …
```
