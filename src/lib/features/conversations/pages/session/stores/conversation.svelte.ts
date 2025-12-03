import type { ConversationDTO } from '$lib/types/conversation/domain/conversation';

class ConversationStore {
	public conversation = $state<ConversationDTO>({} as ConversationDTO);
	public isLoaded = $state(false);

	public create(conversation: ConversationDTO) {
		this.conversation = conversation;
		this.isLoaded = true;
	}
}

export const conversationStore = new ConversationStore();
