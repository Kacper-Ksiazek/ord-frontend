# Logout

**Spec:** `e2e/features/auth/flows/03-logout.spec.ts`  
**Plan:** E2E-104 · **Priority:** P0 · **Fixture:** `authenticatedPage`

**Requires:** `.env.e2e` (OTP), backend up  
**PO:** `ConversationsListPage`, `SidebarComponent`

| Test                                            | Overview                                                                        |
| ----------------------------------------------- | ------------------------------------------------------------------------------- |
| Logout clears session and blocks private routes | Sidebar logout → `/login`; storage cleared; `/conversations` redirects to login |
