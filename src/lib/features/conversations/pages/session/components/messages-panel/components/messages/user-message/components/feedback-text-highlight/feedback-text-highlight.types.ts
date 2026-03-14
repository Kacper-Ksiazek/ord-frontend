import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';

export interface FeedbackTextHighlightProps {
	id: string;
	disableHoverHighlight?: boolean;
	highlightType: MessageFeedbackCriteria;
	highlightedText: string;
	feedback: ConversationUserMessageFeedbackDTO;
	showIconsInHighlightedParts: boolean;
}
