# Login — validation errors

- **Spec:** `e2e/flows/01-auth/01-login-validation-errors.spec.ts`
- **Feature:** `auth`
- **Module:** `01-auth`
- **Plan IDs:** E2E-102
- **Status:** implemented

---

### Submit button is disabled when email has no @ symbol

- **Feature:** `auth`
- **Priority:** P0
- **Type:** edge case
- **Overview:** Entering an invalid email (no `@`) keeps the email submit button disabled — no API call, no alert.
- **Prerequisites:** None (no auth env required)
- **Page objects:** `LoginPage`
- **Fixture:** `pages.fixture` — `loginPage`
- **Duplicate check:** ✅ No overlap

### Submit button is disabled when email is cleared

- **Feature:** `auth`
- **Priority:** P0
- **Type:** edge case
- **Overview:** Clearing the email field after `goto()` keeps submit disabled. Login page defaults to empty email — test explicitly calls `fillEmail('')`.
- **Prerequisites:** None
- **Page objects:** `LoginPage`
- **Fixture:** `pages.fixture` — `loginPage`
- **Duplicate check:** ✅ No overlap

## Notes

- App validates client-side only via disabled button — no error toast for invalid email.
