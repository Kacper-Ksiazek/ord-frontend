# E2E scenario registry

Living register of **implemented** Playwright E2E user flows. Specs live in `e2e/features/`; each spec has a **compact card** in this folder (one file per `*.spec.ts`).

| Document                                                                                                          | Purpose                                       |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| This file                                                                                                         | Index (per spec), roadmap, how to add         |
| [`docs/e2e-test-plan.md`](../../../docs/e2e-test-plan.md)                                                         | Strategic plan, infra, tech debt, backlog IDs |
| [`docs/ai-rules/testing/e2e-tests-playwright.md`](../../../docs/ai-rules/testing/e2e-tests-playwright.md)         | POM + FDD layout conventions for agents       |
| [`docs/ai-rules/testing/e2e-scenario-registry.md`](../../../docs/ai-rules/testing/e2e-scenario-registry.md)       | Scenario docs lifecycle and card template     |
| [`docs/ai-rules/testing/e2e-app-bugs-block-tests.md`](../../../docs/ai-rules/testing/e2e-app-bugs-block-tests.md) | App bugs block specs — notify developer first |

## Implemented specs (20 tests)

| Plan             | Module                                            | Spec                         | Tests | Doc                                                   |
| ---------------- | ------------------------------------------------- | ---------------------------- | ----- | ----------------------------------------------------- |
| E2E-101          | [auth](./auth/)                                   | `00-login-happy-path`        | 2     | [→](./auth/00-login-happy-path.md)                    |
| E2E-102          | [auth](./auth/)                                   | `01-login-validation-errors` | 2     | [→](./auth/01-login-validation-errors.md)             |
| E2E-103          | [auth](./auth/)                                   | `02-session-persistence`     | 2     | [→](./auth/02-session-persistence.md)                 |
| E2E-104          | [auth](./auth/)                                   | `03-logout`                  | 1     | [→](./auth/03-logout.md)                              |
| E2E-201          | [conversations/list](./conversations/list/)       | `00-list-navigation`         | 3     | [→](./conversations/list/00-list-navigation.md)       |
| E2E-202          | [conversations/list](./conversations/list/)       | `01-list-filters`            | 2     | [→](./conversations/list/01-list-filters.md)          |
| E2E-301, E2E-303 | [conversations/create](./conversations/create/)   | `00-create-conversation`     | 3     | [→](./conversations/create/00-create-conversation.md) |
| E2E-302          | [conversations/create](./conversations/create/)   | `01-topic-suggestions`       | 1     | [→](./conversations/create/01-topic-suggestions.md)   |
| E2E-401–404      | [conversations/session](./conversations/session/) | `00-live-session`            | 4     | [→](./conversations/session/00-live-session.md)       |

## Roadmap

Phases align with [`docs/e2e-test-plan.md`](../../../docs/e2e-test-plan.md). New spec cards appear here **when the spec is merged** — not before.

| Phase | Feature module                    | Scope                           | Plan IDs             | Status      |
| ----- | --------------------------------- | ------------------------------- | -------------------- | ----------- |
| 0     | —                                 | Playwright infra, fixtures, CI  | E2E-000–011          | ✅ done     |
| 1     | `features/auth/`                  | OTP login, session, logout      | E2E-101–104          | ✅ 4 specs  |
| 2     | —                                 | `data-testid` in app            | E2E-110              | ✅ done     |
| 3     | `features/conversations/list/`    | List load and navigation        | E2E-201              | ✅ 1 spec   |
| 4     | `features/conversations/create/`  | Create flow (4 steps)           | E2E-301, E2E-303     | ✅ 1 spec   |
| 5     | `features/conversations/session/` | Live chat, SSE, messaging       | E2E-401–404          | ✅ 1 spec   |
| 6     | `features/conversations/session/` | Feedback panel flows            | E2E-501–504          | ⬜ **next** |
| 7     | `features/conversations/list/`    | List filters, AI topics         | E2E-202, E2E-302     | ✅ 2 specs  |
| 8     | —                                 | Text-to-speech                  | E2E-601              | ⬜ planned  |
| 9     | —                                 | Activity heatmap, theme, locale | E2E-203, E2E-701–702 | ⬜ planned  |

## Adding a scenario

Follow [`docs/ai-rules/testing/e2e-scenario-registry.md`](../../../docs/ai-rules/testing/e2e-scenario-registry.md). Summary:

1. Propose flows in Jira/chat (full block) — human approval first.
2. Implement spec in `e2e/features/<feature>/…/flows/<nn-name>.spec.ts`.
3. Add compact card `<nn-name>.md` (metadata once + test table + optional Notes).
4. Add one row to the **Implemented specs** table above when green on the real user path.
