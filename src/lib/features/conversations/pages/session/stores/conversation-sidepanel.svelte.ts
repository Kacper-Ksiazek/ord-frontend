class ConversationSidepanelStore {
	public isSidepanelOpened = $state(false);

	public toggleSidepanel() {
		this.isSidepanelOpened = !this.isSidepanelOpened;
	}
}

export const conversationSidepanelStore = new ConversationSidepanelStore();
