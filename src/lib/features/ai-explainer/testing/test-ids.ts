export const E2E_TEST_IDS = {
	explainPopover: {
		trigger: 'sidebar-explain-phrase',
		root: 'explain-phrase-popover',
		tabs: 'explain-phrase-popover-tabs',
		phrase: 'explain-phrase-popover-phrase',
		clearPhrase: 'explain-phrase-popover-clear-phrase',
		context: 'explain-phrase-popover-context',
		customInstruction: 'explain-phrase-popover-custom-instruction',
		advancedToggle: 'explain-phrase-popover-advanced-toggle',
		submit: 'explain-phrase-popover-submit',
		close: 'explain-phrase-popover-close',
		followUp: (action: string) => `explain-phrase-popover-follow-up-${action}`,
		explanation: 'explain-phrase-popover-explanation',
		explanationSkeleton: 'explain-phrase-popover-explanation-skeleton',
		moreExamplesSkeleton: 'explain-phrase-popover-more-examples-skeleton',
		similarSkeleton: 'explain-phrase-popover-similar-skeleton',
		example: (index: number) => `explain-phrase-popover-example-${index}`
	}
} as const;
