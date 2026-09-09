/** E2E test IDs for words capture — used in Svelte markup and Playwright page objects. */
export const E2E_TEST_IDS = {
	inbox: {
		page: 'words-inbox-page',
		heading: 'words-inbox-heading',
		root: 'words-inbox-list',
		viewToggle: 'words-inbox-view-toggle',
		viewToggleOption: (mode: string) => `words-inbox-view-${mode}`,
		viewPendingCount: 'words-inbox-view-pending-count',
		row: (id: string) => `words-inbox-row-${id}`,
		detailPanel: 'words-inbox-detail-panel',
		detailClose: 'words-inbox-detail-close',
		detailBookmark: 'words-inbox-detail-bookmark',
		detailSkeleton: 'words-inbox-detail-skeleton',
		detailAiSkeleton: 'words-inbox-detail-ai-skeleton',
		detailEmptyState: 'words-inbox-detail-empty-state',
		detailFillManually: 'words-inbox-detail-fill-manually',
		detailSourceWordTts: 'words-inbox-detail-source-word-tts',
		detailExampleSentenceTts: (index: number) => `words-inbox-detail-example-sentence-tts-${index}`,
		detailManualForm: 'words-inbox-detail-manual-form',
		filters: 'words-inbox-filters',
		filterSearch: 'words-inbox-filter-search',
		filterWordType: 'words-inbox-filter-word-type',
		filterExtraMark: 'words-inbox-filter-extra-mark',
		filterBank: 'words-inbox-filter-bank',
		filterClear: 'words-inbox-filter-clear',
		filterPopover: 'words-inbox-filter-popover',
		filterPopoverTrigger: 'words-inbox-filter-popover-trigger',
		filterBookmarkedOnly: 'words-inbox-filter-bookmarked-only',
		filterBookmarkedCount: 'words-inbox-filter-bookmarked-count',
		listSkeleton: 'words-inbox-list-skeleton',
		rowBookmark: (id: string) => `words-inbox-row-bookmark-${id}`
	},
	capturePopover: {
		trigger: 'sidebar-capture-words',
		root: 'capture-words-popover',
		saveStatusLoading: 'capture-words-popover-save-loading',
		saveStatusSuccess: 'capture-words-popover-save-success',
		saveStatusError: 'capture-words-popover-save-error'
	}
} as const;
