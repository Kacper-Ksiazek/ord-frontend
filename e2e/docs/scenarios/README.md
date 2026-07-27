# E2E scenario registry

Living register of **implemented** Playwright E2E user flows. Specs live in `e2e/features/`; this folder mirrors that FDD layout with human-readable descriptions.

| Document                                                                                                          | Purpose                                       |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| This file                                                                                                         | Index, roadmap, how to add scenarios          |
| [`docs/e2e-test-plan.md`](../../../docs/e2e-test-plan.md)                                                         | Strategic plan, infra, tech debt, backlog IDs |
| [`docs/ai-rules/testing/e2e-tests-playwright.md`](../../../docs/ai-rules/testing/e2e-tests-playwright.md)         | POM + FDD layout conventions for agents       |
| [`docs/ai-rules/testing/e2e-scenario-registry.md`](../../../docs/ai-rules/testing/e2e-scenario-registry.md)       | Scenario docs lifecycle and status rules      |
| [`docs/ai-rules/testing/e2e-app-bugs-block-tests.md`](../../../docs/ai-rules/testing/e2e-app-bugs-block-tests.md) | App bugs block specs — notify developer first |

## Implemented scenarios (17 tests)

| ID      | Module                                            | Scenario                                | Spec                                                         | Doc                                                   |
| ------- | ------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| E2E-101 | [auth](./auth/)                                   | Redirect → login → conversations        | `features/auth/flows/00-login-happy-path`                    | [→](./auth/00-login-happy-path.md)                    |
| E2E-101 | [auth](./auth/)                                   | Sidebar shows user email after login    | `features/auth/flows/00-login-happy-path`                    | [→](./auth/00-login-happy-path.md)                    |
| E2E-102 | [auth](./auth/)                                   | Email validation — no `@`               | `features/auth/flows/01-login-validation-errors`             | [→](./auth/01-login-validation-errors.md)             |
| E2E-102 | [auth](./auth/)                                   | Email validation — empty field          | `features/auth/flows/01-login-validation-errors`             | [→](./auth/01-login-validation-errors.md)             |
| E2E-103 | [auth](./auth/)                                   | Session survives reload                 | `features/auth/flows/02-session-persistence`                 | [→](./auth/02-session-persistence.md)                 |
| E2E-103 | [auth](./auth/)                                   | Session restored in new browser context | `features/auth/flows/02-session-persistence`                 | [→](./auth/02-session-persistence.md)                 |
| E2E-104 | [auth](./auth/)                                   | Logout clears session                   | `features/auth/flows/03-logout`                              | [→](./auth/03-logout.md)                              |
| E2E-201 | [conversations/list](./conversations/list/)       | List loads with filters and rows        | `features/conversations/list/flows/00-list-navigation`       | [→](./conversations/list/00-list-navigation.md)       |
| E2E-201 | [conversations/list](./conversations/list/)       | New conversation button → create flow   | `features/conversations/list/flows/00-list-navigation`       | [→](./conversations/list/00-list-navigation.md)       |
| E2E-201 | [conversations/list](./conversations/list/)       | Row click → session page                | `features/conversations/list/flows/00-list-navigation`       | [→](./conversations/list/00-list-navigation.md)       |
| E2E-301 | [conversations/create](./conversations/create/)   | Full happy path → new session           | `features/conversations/create/flows/00-create-conversation` | [→](./conversations/create/00-create-conversation.md) |
| E2E-303 | [conversations/create](./conversations/create/)   | Step validation blocks advance          | `features/conversations/create/flows/00-create-conversation` | [→](./conversations/create/00-create-conversation.md) |
| E2E-303 | [conversations/create](./conversations/create/)   | Back navigation preserves selections    | `features/conversations/create/flows/00-create-conversation` | [→](./conversations/create/00-create-conversation.md) |
| E2E-401 | [conversations/session](./conversations/session/) | AI greeting after SSE init              | `features/conversations/session/flows/00-live-session`       | [→](./conversations/session/00-live-session.md)       |
| E2E-402 | [conversations/session](./conversations/session/) | Send message and receive AI reply       | `features/conversations/session/flows/00-live-session`       | [→](./conversations/session/00-live-session.md)       |
| E2E-403 | [conversations/session](./conversations/session/) | Resume conversation from list           | `features/conversations/session/flows/00-live-session`       | [→](./conversations/session/00-live-session.md)       |
| E2E-404 | [conversations/session](./conversations/session/) | Back button returns to list             | `features/conversations/session/flows/00-live-session`       | [→](./conversations/session/00-live-session.md)       |

## Roadmap

Phases align with [`docs/e2e-test-plan.md`](../../../docs/e2e-test-plan.md). New scenario docs appear here **when the spec is merged** — not before.

| Phase | Feature module                    | Scope                           | Plan IDs             | Status                                |
| ----- | --------------------------------- | ------------------------------- | -------------------- | ------------------------------------- |
| 0     | —                                 | Playwright infra, fixtures, CI  | E2E-000–011          | ✅ done                               |
| 1     | `features/auth/`                  | OTP login, session, logout      | E2E-101–104          | ✅ [4 specs](./auth/)                 |
| 2     | —                                 | `data-testid` in app            | E2E-110              | ✅ done                               |
| 3     | `features/conversations/list/`    | List load and navigation        | E2E-201              | ✅ [1 spec](./conversations/list/)    |
| 4     | `features/conversations/create/`  | Create flow (4 steps)           | E2E-301, E2E-303     | ✅ [1 spec](./conversations/create/)  |
| 5     | `features/conversations/session/` | Live chat, SSE, messaging       | E2E-401–404, E2E-006 | ✅ [1 spec](./conversations/session/) |
| 6     | `features/conversations/session/` | Feedback panel flows            | E2E-501–504          | ⬜ **next**                           |
| 7     | `features/conversations/list/`    | List filters, AI topics         | E2E-202, E2E-302     | ⬜ planned                            |
| 8     | —                                 | Text-to-speech                  | E2E-601              | ⬜ planned                            |
| 9     | —                                 | Activity heatmap, theme, locale | E2E-203, E2E-701–702 | ⬜ planned                            |

## Directory layout

```
e2e/docs/scenarios/
├── README.md                 # this file — index + roadmap
└── <feature>/                # mirrors e2e/features/<feature>/
    ├── README.md             # module overview
    └── <nn-name>.md          # 1 file per *.spec.ts
```

## Adding a scenario

Follow [`docs/ai-rules/testing/e2e-scenario-registry.md`](../../../docs/ai-rules/testing/e2e-scenario-registry.md). Summary:

1. Propose the flow (feature, priority, prerequisites) — playwright-propose-e2e-scenarios skill format; human approval first.
2. Implement spec in `e2e/features/<feature>/…/flows/<nn-name>.spec.ts` with Page Objects in the same feature module — fix app bugs before encoding workarounds.
3. Add or update `<nn-name>.md` in the matching folder (one `###` section per `test()`).
4. Update this README index table and roadmap row when the spec is green on the real user path.
5. Link plan IDs from `docs/e2e-test-plan.md` when applicable.
