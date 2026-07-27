# Logout

- **Spec:** `e2e/flows/01-auth/03-logout.spec.ts`
- **Feature:** `auth`
- **Module:** `01-auth`
- **Plan IDs:** E2E-104
- **Status:** implemented

---

### Logout clears session and blocks private routes

- **Feature:** `auth`
- **Priority:** P0
- **Type:** happy path
- **Overview:** From the conversations list, user logs out via sidebar. Redirects to `/login`, stored user is cleared, and revisiting `/conversations` redirects back to login.
- **Prerequisites:** `.env.e2e` with OTP config; backend running
- **Page objects:** `ConversationsListPage`, `SidebarComponent`
- **Helpers:** `storage.ts` (`getStoredUser`)
- **Fixture:** `auth.fixture` — `authenticatedPage`
- **Duplicate check:** ✅ No overlap
