export const E2E_TEST_IDS = {
	home: {
		page: 'home-page',
		greeting: 'home-greeting',
		wordsCard: 'home-words-card',
		wordsTrendChart: 'home-words-trend-chart',
		conversationsCard: 'home-conversations-card',
		conversationsTrendChart: 'home-conversations-trend-chart',
		gamesCard: 'home-games-card',
		gamesTrendChart: 'home-games-trend-chart',
		gamesComingSoon: 'home-games-coming-soon',
		gamesCounts: 'home-games-counts',
		heatmap: 'home-year-heatmap',
		skeleton: 'home-skeleton',
		skeletonDevtoolsToggle: 'home-skeleton-devtools-toggle',
		skeletonDevtoolsPanel: 'home-skeleton-devtools-panel',
		skeletonDevtoolsSwitch: 'home-skeleton-devtools-switch',
		recentWordsSection: 'home-recent-words-section',
		recentWordsViewAll: 'home-recent-words-view-all',
		recentWordRow: (id: string) => `home-recent-word-row-${id}`,
		recentConversationsSection: 'home-recent-conversations-section',
		recentConversationsViewAll: 'home-recent-conversations-view-all',
		recentConversationRow: (id: string) => `home-recent-conversation-row-${id}`,
		recentAddWordButton: 'home-recent-add-word-button',
		recentNewConversationButton: 'home-recent-new-conversation-button'
	}
};
