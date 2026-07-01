/**
 * Central E2E test IDs — single source of truth for app markup and Playwright selectors.
 * Import in Svelte components and in `e2e/helpers/test-ids.ts`.
 */
export const E2E_TEST_IDS = {
	login: {
		page: 'login-page',
		emailForm: 'login-email-form',
		emailInput: 'login-email-input',
		emailSubmit: 'login-email-submit',
		otpForm: 'login-otp-form',
		otpInput: 'login-otp-input',
		otpSubmit: 'login-otp-submit',
		error: 'login-error',
		otpDigit: (index: number) => `login-otp-digit-${index}`
	},
	sidebar: {
		root: 'sidebar',
		toggle: 'sidebar-toggle',
		userEmail: 'sidebar-user-email',
		logout: 'sidebar-logout'
	},
	conversations: {
		page: 'conversations-page',
		heading: 'conversations-heading',
		newButton: 'conversations-new-button',
		list: 'conversations-list',
		filters: 'conversations-filters',
		filterSearch: 'conversations-filter-search',
		filterRecency: 'conversations-filter-recency',
		filterType: 'conversations-filter-type',
		filterClear: 'conversations-filter-clear',
		row: (id: string) => `conversation-row-${id}`
	},
	createConversation: {
		page: 'create-conversation-page',
		error: 'create-conversation-error',
		stepper: 'create-conversation-stepper',
		step: (index: number) => `create-conversation-step-${index}`,
		previous: 'create-conversation-previous',
		next: 'create-conversation-next',
		start: 'create-conversation-start',
		stepType: 'create-conversation-step-type',
		stepTone: 'create-conversation-step-tone',
		stepTopic: 'create-conversation-step-topic',
		stepSummary: 'create-conversation-step-summary',
		typeCard: (type: string) => `conversation-type-card-${type}`,
		toneCard: (tone: string) => `conversation-tone-card-${tone}`,
		topicPicker: 'create-conversation-topic-picker',
		topicRow: (index: number) => `topic-row-${index}`,
		topicGenerateButton: 'topic-generate-button',
		topicGenerateClueInput: 'topic-generate-clue-input',
		topicCustomToggle: 'topic-custom-toggle',
		topicCustomInput: 'topic-custom-input'
	},
	session: {
		page: 'conversation-session-page',
		messagesPanel: 'messages-panel',
		backButton: 'session-back-button',
		summaryToggle: 'session-summary-toggle',
		messageComposer: 'session-message-composer',
		messageInput: 'session-message-input',
		sendButton: 'session-send-button',
		aiMessage: (index: number) => `ai-message-${index}`,
		userMessage: (index: number) => `user-message-${index}`,
		messageTtsButton: (index: number) => `message-tts-button-${index}`,
		messageLearningTips: (index: number) => `message-learning-tips-${index}`,
		messageAnalysis: (index: number) => `message-analysis-${index}`,
		feedbackPanel: 'feedback-panel',
		feedbackSummary: 'feedback-summary',
		feedbackSummaryTabs: 'feedback-summary-tabs'
	}
} as const;
