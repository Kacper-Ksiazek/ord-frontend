export type WordsInboxViewMode = 'list' | 'analytics';

export const WORDS_INBOX_VIEW_MODES = [
	'list',
	'analytics'
] as const satisfies readonly WordsInboxViewMode[];
