/** Test ids for the explain request/answer parts, shared by the modal and the inline block. */
function explainPanelTestIds(prefix: string) {
	return {
		phrase: `${prefix}-phrase`,
		clearPhrase: `${prefix}-clear-phrase`,
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
	explainPopover: {
		trigger: 'sidebar-explain-phrase',
		root: 'explain-phrase-popover',
		tabs: 'explain-phrase-popover-tabs',
		close: 'explain-phrase-popover-close',
		...explainPanelTestIds('explain-phrase-popover')
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
