import type { components } from '@ord-api/ord-api-types';
import type { ConversationUserMessageFeedbackDTO } from './conversation-message-feedback';

export type ConversationMessageSender = components['schemas']['ConversationMessageDTO']['sender'];

export type ConversationMessageDTO = components['schemas']['ConversationMessageDTO'];

export type CompactConversationAiMessage = {
	sender: 'AI';
	content: string;
};

export type CompactConversationUserMessage = {
	sender: 'USER';
	content: string;
	feedback: ConversationUserMessageFeedbackDTO | null;
};

export type CompactConversationMessage =
	| CompactConversationAiMessage
	| CompactConversationUserMessage;
