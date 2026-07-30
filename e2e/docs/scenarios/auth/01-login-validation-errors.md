# Login — validation errors

**Spec:** `e2e/features/auth/flows/01-login-validation-errors.spec.ts`  
**Plan:** E2E-102 · **Priority:** P0 · **Fixture:** `pages.fixture`

**PO:** `LoginPage`

| Test                                                 | Overview                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------- |
| Submit button is disabled when email has no @ symbol | Invalid email keeps submit disabled — no API call             |
| Submit button is disabled when email is cleared      | Explicit `fillEmail('')` after `goto()` keeps submit disabled |

**Notes:** Client-side validation only (disabled button) — no error toast for invalid email.
