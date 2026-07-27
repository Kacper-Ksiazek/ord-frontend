# Auth (`01-auth`)

**FDD feature:** `src/lib/features/auth/`

OTP email login, session persistence, and logout. Smoke coverage — not exhaustive OTP edge cases.

| Spec                                                          | Scenarios | Plan IDs | Status |
| ------------------------------------------------------------- | --------- | -------- | ------ |
| [00-login-happy-path](./00-login-happy-path.md)               | 2         | E2E-101  | ✅     |
| [01-login-validation-errors](./01-login-validation-errors.md) | 2         | E2E-102  | ✅     |
| [02-session-persistence](./02-session-persistence.md)         | 2         | E2E-103  | ✅     |
| [03-logout](./03-logout.md)                                   | 1         | E2E-104  | ✅     |

**Page objects:** `LoginPage`, `SidebarComponent`  
**Helpers:** `otp.ts`, `storage.ts` (`getStoredUser`)  
**Fixtures:** `pages.fixture`, `auth.fixture`
