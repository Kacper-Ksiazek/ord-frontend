import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
import type {
	CompactConversationMessage,
	CompactConversationUserMessage
} from '$lib/types/conversation/domain/conversation-message';
import type { ConversationDTO } from '$lib/types/conversation/domain/conversation';

class ConversationMessagesStore {
	public isGenerating = $state(false);
	public messages = $state<CompactConversationMessage[]>([]);

	public create(conversation: ConversationDTO) {
		this.messages = conversation.messages.map((message) => {
			if (message.sender === 'AI') {
				return {
					sender: 'AI',
					content: message.content
				} satisfies CompactConversationMessage;
			}

			return {
				sender: 'USER',
				content: message.content,
				feedback: message.feedback ?? null
			} satisfies CompactConversationMessage;
		});
	}

	public saveUserMessage(message: CompactConversationUserMessage) {
		this.messages.push(message);
	}

	public saveUserMessageFeedback(
		messageIndex: number,
		feedback: ConversationUserMessageFeedbackDTO
	) {
		if (this.messages[messageIndex].sender === 'USER') {
			(this.messages[messageIndex] as CompactConversationUserMessage).feedback = feedback;
		}
	}

	/**
	 * Creates a room for a new AI message that is about to be generated.
	 */
	public initializeAiMessageGeneration() {
		this.isGenerating = true;
		this.messages.push({
			sender: 'AI',
			content: ''
		});
	}

	/**
	 * Adds a letter to the last AI message that is still generating (SSE stream).
	 */
	public addGeneratedAiMessageLetter(letter: string) {
		this.messages[this.messages.length - 1].content += letter;
	}
}

export const conversationMessagesStore = new ConversationMessagesStore();
