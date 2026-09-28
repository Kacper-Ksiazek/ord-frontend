export const E2E_TEST_IDS = {
	explainPopover: {
		trigger: 'sidebar-explain-phrase',
		root: 'explain-phrase-popover',
		tabs: 'explain-phrase-popover-tabs',
		phrase: 'explain-phrase-popover-phrase',
		advancedToggle: 'explain-phrase-popover-advanced-toggle',
		submit: 'explain-phrase-popover-submit',
		followUp: (action: string) => `explain-phrase-popover-follow-up-${action}`,
		explanation: 'explain-phrase-popover-explanation',
		explanationSkeleton: 'explain-phrase-popover-explanation-skeleton',
		similarSkeleton: 'explain-phrase-popover-similar-skeleton',
		example: (index: number) => `explain-phrase-popover-example-${index}`
	}
} as const;
