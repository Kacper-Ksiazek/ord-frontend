# Session persistence

**Spec:** `e2e/features/auth/flows/02-session-persistence.spec.ts`  
**Plan:** E2E-103 · **Priority:** P0 · **Fixture:** `auth.fixture`

**Requires:** `.env.e2e` (OTP), backend up  
**PO:** `LoginPage`, `ConversationsListPage`

| Test                                                           | Overview                                                               |
| -------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Session survives page reload                                   | After login, reload `/conversations` — still authenticated, list loads |
| Session is restored in a new browser context via storage state | Login → `storageState` → new context; `getStoredUser` non-null         |

**Notes:** In-memory `storageState` only — no shared `e2e/.auth` file.
