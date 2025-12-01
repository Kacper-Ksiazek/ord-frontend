import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
import type {
	CompactConversationMessage,
	CompactConversationUserMessage
} from '$lib/types/conversation/domain/conversation-message';

class ConversationMessagesStore {
	private _isGenerating = $state(true);
	private _messages = $state<CompactConversationMessage[]>([
		{
			sender: 'AI',
			content:
				'Ipsum amet fugiat laboris proident excepteur cupidatat exercitation magna culpa et commodo voluptate voluptate cupidatat. Et aliqua nisi laborum sit ex laborum mollit nulla aute cupidatat in officia nulla minim duis. Culpa irure velit pariatur commodo tempor. Amet reprehenderit consequat do aliquip ut Lorem est elit. Eiusmod eiusmod occaecat cupidatat ipsum ex ad laborum. Pariatur laboris quis cupidatat laboris anim nisi.'
		},
		{
			sender: 'USER',
			content:
				'Sint non minim cillum ipsum eu eu minim fugiat consequat voluptate. Minim laborum adipisicing tempor. Officia nostrud dolor eiusmod et velit eu consectetur. Consequat ipsum ullamco commodo occaecat elit officia consectetur aliqua incididunt mollit laboris.',
			feedback: null
		},
		{
			sender: 'AI',
			content: ''
		}
	]);

	public get isGenerating() {
		return this._isGenerating;
	}

	public get messages() {
		return this._messages;
	}

	public setIsGenerating(value: boolean) {
		this._isGenerating = value;
	}

	public saveUserMessage(message: CompactConversationUserMessage) {
		this._messages.push(message);
	}

	public saveUserMessageFeedback(
		messageIndex: number,
		feedback: ConversationUserMessageFeedbackDTO
	) {
		if (this._messages[messageIndex].sender === 'USER') {
			(this._messages[messageIndex] as CompactConversationUserMessage).feedback = feedback;
		}
	}

	/**
	 * Creates a room for a new AI message that is about to be generated.
	 */
	public initializeAiMessageGeneration() {
		this._isGenerating = true;
		this._messages.push({
			sender: 'AI',
			content: ''
		});
	}

	/**
	 * Adds a letter to the last AI message that is still generating (SSE stream).
	 */
	public addGeneratedAiMessageLetter(letter: string) {
		this._messages[this._messages.length - 1].content += letter;
	}
}

export const conversationMessagesStore = new ConversationMessagesStore();
