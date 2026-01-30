import type { components } from '@ord-api/ord-api-types';
import type { ConversationUserMessageFeedbackDTO } from './conversation-message-feedback';
import type { AIMessageLearningTips } from '$lib/types/ongoing-conversation/api/responses';

export type ConversationMessageSender = components['schemas']['ConversationMessageDTO']['sender'];

export type ConversationMessageDTO = components['schemas']['ConversationMessageDTO'];

export type CompactConversationAiMessage = {
	sender: 'AI';
	content: string;
	learningTips?: AIMessageLearningTips | null;
	createdAt: string;
};

export type CompactConversationUserMessage = {
	sender: 'USER';
	content: string;
	feedback: ConversationUserMessageFeedbackDTO | null;
	createdAt: string;
};

export type CompactConversationMessage =
	| CompactConversationAiMessage
	| CompactConversationUserMessage;
