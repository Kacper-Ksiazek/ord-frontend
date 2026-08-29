/** E2E test IDs for quickly-added-words — used in Svelte markup and Playwright page objects. */
export const E2E_TEST_IDS = {
	list: {
		page: 'qaw-list-page',
		heading: 'qaw-list-heading',
		root: 'qaw-list',
		row: (id: string) => `qaw-row-${id}`
	},
	popover: {
		trigger: 'sidebar-add-qaw',
		root: 'add-qaw-popover',
		saveStatusLoading: 'add-qaw-popover-save-loading',
		saveStatusSuccess: 'add-qaw-popover-save-success',
		saveStatusError: 'add-qaw-popover-save-error'
	}
} as const;
