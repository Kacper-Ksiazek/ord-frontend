# Session persistence

- **Spec:** `e2e/flows/01-auth/02-session-persistence.spec.ts`
- **Feature:** `auth`
- **Module:** `01-auth`
- **Plan IDs:** E2E-103
- **Status:** implemented

---

### Session survives page reload

- **Feature:** `auth`
- **Priority:** P0
- **Type:** happy path
- **Overview:** After login, reloading `/conversations` keeps the user authenticated and the list loads.
- **Prerequisites:** `.env.e2e` with OTP config; backend running
- **Page objects:** `ConversationsListPage`
- **Fixture:** `auth.fixture` — `authenticatedPage`
- **Duplicate check:** ✅ No overlap

### Session is restored in a new browser context via storage state

- **Feature:** `auth`
- **Priority:** P0
- **Type:** happy path
- **Overview:** Login in one browser context, capture `storageState`, open a new context with that state — user remains logged in and `getStoredUser` returns data.
- **Prerequisites:** OTP config; backend running
- **Page objects:** `LoginPage`, `ConversationsListPage` (factory in new context)
- **Helpers:** `storage.ts` (`getStoredUser`)
- **Fixture:** `auth.fixture` — `browser` only (manual login in source context)
- **Duplicate check:** ✅ No overlap

## Notes

- Uses in-memory `storageState` from current login — no shared `e2e/.auth` file between tests.
