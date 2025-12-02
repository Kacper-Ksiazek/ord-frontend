import type { ConversationDTO } from '$lib/types/conversation/domain/conversation';

class ConversationStore {
	public conversation = $state<ConversationDTO>({} as ConversationDTO);
	public isLoading = $state(false);

	public initialize(conversation: ConversationDTO) {
		this.conversation = conversation;
		this.isLoading = false;
	}
}

export const conversationStore = new ConversationStore();
