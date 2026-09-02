/** E2E test IDs for words capture — used in Svelte markup and Playwright page objects. */
export const E2E_TEST_IDS = {
	inbox: {
		page: 'words-inbox-page',
		heading: 'words-inbox-heading',
		root: 'words-inbox-list',
		row: (id: string) => `words-inbox-row-${id}`
	},
	capturePopover: {
		trigger: 'sidebar-capture-words',
		root: 'capture-words-popover',
		saveStatusLoading: 'capture-words-popover-save-loading',
		saveStatusSuccess: 'capture-words-popover-save-success',
		saveStatusError: 'capture-words-popover-save-error'
	}
} as const;
