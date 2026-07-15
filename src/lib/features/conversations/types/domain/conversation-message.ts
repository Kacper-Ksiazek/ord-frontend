import type { components } from '@kacper-ksiazek/ord-api-types';
import type { ConversationUserMessageAnalysisDTO } from './conversation-message-analysis';
import type { AIMessageLearningTips } from './ai-message-learning-tips';

export type ConversationMessageDTO = components['schemas']['ConversationMessageDTO'];

// The openapi-typescript generator uses Java class names as TypeScript discriminants
// (sender: "ConversationAIMessageDTO" | "ConversationUserMessageDTO"), but the runtime
// JSON sends sender: "AI" | "USER". This normalized union matches the actual runtime shape.
export type NormalizedConversationMessage =
	| (Omit<components['schemas']['ConversationAIMessageDTO'], 'sender'> & { sender: 'AI' })
	| (Omit<components['schemas']['ConversationUserMessageDTO'], 'sender'> & { sender: 'USER' });

export type CompactConversationAiMessage = {
	sender: 'AI';
	content: string;
	learningTips?: AIMessageLearningTips | null;
	createdAt: string;
};

export type CompactConversationUserMessage = {
	sender: 'USER';
	content: string;
	analysis: ConversationUserMessageAnalysisDTO | null;
	/** Set when analysis request fails so UI can show error instead of perpetual loading. */
	analysisFailed?: boolean;
	/** Client-generated id used to retry analysis after a failure. */
	messageId?: string;
	createdAt: string;
};

export type CompactConversationMessage =
	| CompactConversationAiMessage
	| CompactConversationUserMessage;
