import type { ConversationDTO } from '$lib/types/conversation/domain/conversation';
import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
import type { CompactConversationAiMessage } from '$lib/types/conversation/domain/conversation-message';
import { createContext } from 'svelte';

export type { CompactConversationAiMessage };

export type CompactConversationUserMessage = {
	sender: 'USER';
	content: string;
	feedback: ConversationUserMessageFeedbackDTO | null;
};

export type CompactConversationMessage =
	| CompactConversationAiMessage
	| CompactConversationUserMessage;

export type MessagesContext = {
	messages: CompactConversationMessage[];
	isGenerating: boolean;
};

export const [getMessagesContext, setMessagesContext] = createContext<MessagesContext>();

export function createMessagesContext(conversation: ConversationDTO) {
	const context: MessagesContext = $state<MessagesContext>({
		messages: conversation.messages.map((message) => {
			if (message.sender === 'AI') {
				// Convert ConversationAIMessageLearningTipsDTO to AIMessageLearningTips format
				const learningTips = message.learningTips
					? {
							grammarTips: message.learningTips.grammarTips,
							vocabularyTips: message.learningTips.vocabularyTips,
							phraseTips: message.learningTips.phraseTips
						}
					: null;

				return {
					sender: 'AI',
					content: message.content,
					learningTips
				} satisfies CompactConversationMessage;
			}

			return {
				sender: 'USER',
				content: message.content,
				feedback: message.feedback ?? null
			} satisfies CompactConversationMessage;
		}),
		isGenerating: false
	});

	setMessagesContext(context);
}
