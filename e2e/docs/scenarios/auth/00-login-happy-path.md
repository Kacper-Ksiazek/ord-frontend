# Login — happy path

**Spec:** `e2e/features/auth/flows/00-login-happy-path.spec.ts`  
**Plan:** E2E-101 · **Priority:** P0 · **Fixture:** `auth.fixture`, `pages.fixture`

**Requires:** `.env.e2e` (OTP), backend up  
**PO:** `LoginPage`, `ConversationsListPage`, `SidebarComponent`

| Test                                                                       | Overview                                           |
| -------------------------------------------------------------------------- | -------------------------------------------------- |
| Unauthenticated user is redirected to login, then can access conversations | `/conversations` → `/login`; after OTP, list loads |
| After login sidebar shows user email                                       | `authenticatedPage`; sidebar shows test email      |

**Notes:** OTP needs `fillOtp()` + `submitOtp()`; post-login redirect via `/` → `/conversations`.
