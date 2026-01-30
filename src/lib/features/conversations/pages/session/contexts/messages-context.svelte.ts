import type { ConversationDTO } from '$lib/types/conversation/domain/conversation';
import type { CompactConversationMessage } from '$lib/types/conversation/domain/conversation-message';
import { createContext } from 'svelte';

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
							phraseTips: message.learningTips.phraseTips,
							createdAt: message.createdAt
						}
					: null;

				return {
					sender: 'AI',
					content: message.content,
					learningTips,
					createdAt: message.createdAt
				} satisfies CompactConversationMessage;
			}

			return {
				sender: 'USER',
				content: message.content,
				feedback: message.feedback ?? null,
				createdAt: message.createdAt
			} satisfies CompactConversationMessage;
		}),
		isGenerating: false
	});

	setMessagesContext(context);
}
