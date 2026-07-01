/** Centralized UI selectors for E2E tests (role- and aria-based). */

export const loginSelectors = {
	emailInput: '#email',
	emailSubmitButton: 'form:has(#email) button[type="submit"]',
	otpGroup: '[aria-label="OTP Input"]',
	otpDigit: (index: number) => `[aria-label="Digit ${index}"]`,
	otpSubmitButton: 'form:has([aria-label="OTP Input"]) button[type="submit"]',
	errorAlert: '[role="alert"]'
} as const;

export const sidebarSelectors = {
	logoutButton: 'button[title="Logout"]',
	conversationsLink: 'a[href="/conversations"]',
	userEmail: 'aside p.text-xs.text-gray-400'
} as const;

export const conversationsListSelectors = {
	heading: 'h1:has-text("Conversations")',
	newConversationButton: 'button:has-text("New conversation")',
	conversationList: '[aria-label="Your conversations"]',
	conversationRow: '[aria-label="Your conversations"] a, [aria-label="Your conversations"] button'
} as const;

export const createConversationSelectors = {
	multiStepForm: 'form'
} as const;

export const sessionSelectors = {
	messageTextarea: 'textarea',
	sendButton: 'button[type="submit"]'
} as const;
