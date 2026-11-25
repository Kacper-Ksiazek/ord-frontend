/** Test ids for the explain request/answer parts, used by the inline block. */
function explainPanelTestIds(prefix: string) {
	return {
		phrase: `${prefix}-phrase`,
		clearPhrase: `${prefix}-clear-phrase`,
		enhance: `${prefix}-enhance`,
		context: `${prefix}-context`,
		customInstruction: `${prefix}-custom-instruction`,
		advancedToggle: `${prefix}-advanced-toggle`,
		submit: `${prefix}-submit`,
		followUp: (action: string) => `${prefix}-follow-up-${action}`,
		explanation: `${prefix}-explanation`,
		explanationSkeleton: `${prefix}-explanation-skeleton`,
		moreExamplesSkeleton: `${prefix}-more-examples-skeleton`,
		similarSkeleton: `${prefix}-similar-skeleton`,
		example: (index: number) => `${prefix}-example-${index}`
	};
}

export type ExplainPanelTestIds = ReturnType<typeof explainPanelTestIds>;

export const E2E_TEST_IDS = {
	explainHistoryPage: {
		root: 'explain-history-page'
	},
	explainPage: {
		root: 'explain-page',
		history: 'explain-page-history',
		historyItem: (id: string) => `explain-page-history-item-${id}`,
		back: 'explain-page-back',
		historyLink: 'explain-page-history-link',
		historyMenu: (id: string) => `explain-page-history-menu-${id}`,
		historyRemove: (id: string) => `explain-page-history-remove-${id}`,
		historyRemoveBelow: (id: string) => `explain-page-history-remove-below-${id}`
	},
	explainInline: {
		root: 'explain-phrase-inline',
		answer: 'explain-phrase-inline-answer',
		...explainPanelTestIds('explain-phrase-inline')
	},
	phraseExamples: {
		root: 'phrase-examples-stream',
		item: (index: number) => `phrase-examples-stream-item-${index}`,
		skeleton: 'phrase-examples-stream-skeleton',
		regenerate: 'phrase-examples-stream-regenerate'
	}
} as const;
