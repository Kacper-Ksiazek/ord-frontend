# Login — happy path

- **Spec:** `e2e/flows/01-auth/00-login-happy-path.spec.ts`
- **Feature:** `auth`
- **Module:** `01-auth`
- **Plan IDs:** E2E-101
- **Status:** implemented

---

### Unauthenticated user is redirected to login, then can access conversations

- **Feature:** `auth`
- **Priority:** P0
- **Type:** happy path
- **Overview:** Visiting `/conversations` while logged out redirects to `/login`. After OTP login the user can open the conversations list and it loads successfully.
- **Prerequisites:** `.env.e2e` with `E2E_OTP_CODE` or `E2E_OTP_FETCH_URL`; backend running (`make docker-e2e-up` or `make api-up`)
- **Page objects:** `LoginPage`, `ConversationsListPage` (factory)
- **Fixture:** `auth.fixture` — `page`, `loginPage`
- **Duplicate check:** ✅ No overlap

### After login sidebar shows user email

- **Feature:** `auth`
- **Priority:** P0
- **Type:** happy path
- **Overview:** After `authenticatedPage` fixture login, the sidebar displays the logged-in user's email.
- **Prerequisites:** Same as above; sidebar must be expanded (`SidebarComponent.ensureExpanded()`)
- **Page objects:** `ConversationsListPage`, `SidebarComponent`
- **Fixture:** `auth.fixture` — `authenticatedPage`
- **Duplicate check:** ✅ No overlap

## Notes

- Post-OTP redirect lands on `/conversations` (via `/` → 307 in private layout).
- OTP submit requires `fillOtp()` + `submitOtp()` — programmatic fill does not fire `oncomplete`.
