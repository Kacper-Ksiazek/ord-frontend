export const E2E_TEST_IDS = {
	explainPopover: {
		trigger: 'sidebar-explain-phrase',
		root: 'explain-phrase-popover',
		tabs: 'explain-phrase-popover-tabs',
		phrase: 'explain-phrase-popover-phrase',
		submit: 'explain-phrase-popover-submit',
		followUp: (action: string) => `explain-phrase-popover-follow-up-${action}`,
		explanation: 'explain-phrase-popover-explanation',
		example: (index: number) => `explain-phrase-popover-example-${index}`
	}
} as const;
