# Auth (`features/auth`)

**FDD feature:** `src/lib/features/auth/`  
**E2E module:** `e2e/features/auth/`

OTP email login, session persistence, and logout. Smoke coverage — not exhaustive OTP edge cases.

| Spec                                                          | Scenarios | Plan IDs | Status |
| ------------------------------------------------------------- | --------- | -------- | ------ |
| [00-login-happy-path](./00-login-happy-path.md)               | 2         | E2E-101  | ✅     |
| [01-login-validation-errors](./01-login-validation-errors.md) | 2         | E2E-102  | ✅     |
| [02-session-persistence](./02-session-persistence.md)         | 2         | E2E-103  | ✅     |
| [03-logout](./03-logout.md)                                   | 1         | E2E-104  | ✅     |

**Page objects:** `LoginPage` (`e2e/features/auth/pages/`)  
**Shared:** `@e2e/app-layouts` (`SidebarComponent`), `@e2e/shared/helpers` (`otp`, `storage`)  
**Fixtures:** `@e2e/shared/fixtures/pages.fixture`, `auth.fixture`
