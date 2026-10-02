export type ConversationsListViewMode = 'list' | 'summary';

export const CONVERSATIONS_LIST_VIEW_MODES = [
	'list',
	'summary'
] as const satisfies readonly ConversationsListViewMode[];
