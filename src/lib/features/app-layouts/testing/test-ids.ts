/** E2E test IDs for app-layouts — used in Svelte markup and Playwright page objects. */
export const E2E_TEST_IDS = {
	sidebar: {
		root: 'sidebar',
		toggle: 'sidebar-toggle',
		userEmail: 'sidebar-user-email',
		logout: 'sidebar-logout'
	}
} as const;
