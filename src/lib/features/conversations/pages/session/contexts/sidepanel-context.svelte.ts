import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
import { createContext } from 'svelte';

export type SidepanelContext = {
	isOpened: boolean;
	feedbackPreview: ConversationUserMessageFeedbackDTO | null;
};

export const [getSidepanelContext, setSidepanelContext] = createContext<SidepanelContext>();

export function createSidepanelContext(latestFeedback?: ConversationUserMessageFeedbackDTO | null) {
	const context: SidepanelContext = $state(
		latestFeedback
			? {
					isOpened: true,
					feedbackPreview: latestFeedback
				}
			: {
					isOpened: false,
					feedbackPreview: null
				}
	);

	setSidepanelContext(context);
}
