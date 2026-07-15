import type { ConversationDTO } from '$conversations/types';
import type {
	CompactConversationMessage,
	NormalizedConversationMessage
} from '$conversations/types';
import { createContext } from 'svelte';

export type AiStreamErrorKind = 'init' | 'message';

export type MessagesContext = {
	messages: CompactConversationMessage[];
	isGeneratingAiMessage: boolean;
	isGeneratingLearningTips: boolean;
	isGeneratingUserMessageAnalysis: boolean;
	/** User-facing SSE failure after init or send; cleared on dismiss or successful stream. */
	aiStreamError: AiStreamErrorKind | null;
};

export const [getMessagesContext, setMessagesContext] = createContext<MessagesContext>();

export function createMessagesContext(conversation: ConversationDTO) {
	const messages: CompactConversationMessage[] = conversation.messages.map((_message) => {
		const message = _message as unknown as NormalizedConversationMessage;

		if (message.sender === 'AI') {
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
			analysis: message.analysis ?? null,
			createdAt: message.createdAt
		} satisfies CompactConversationMessage;
	});

	const messagesContext = $state<MessagesContext>({
		messages,
		isGeneratingAiMessage: false,
		isGeneratingLearningTips: false,
		isGeneratingUserMessageAnalysis: false,
		aiStreamError: null
	});

	setMessagesContext(messagesContext);
}
