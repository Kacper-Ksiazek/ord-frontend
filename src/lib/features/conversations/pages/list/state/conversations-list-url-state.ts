import type { ConversationsListViewMode } from '$conversations/types/domain/conversations-list-view-mode';

export function parseConversationsListViewMode(value: string | null): ConversationsListViewMode {
	return value === 'summary' ? 'summary' : 'list';
}

export function buildConversationsListQueryString(
	filtersQuery: string,
	viewMode: ConversationsListViewMode
): string {
	const parts: string[] = [];

	if (filtersQuery) {
		parts.push(filtersQuery);
	}

	if (viewMode === 'summary') {
		parts.push('view=summary');
	}

	return parts.join('&');
}

export function parseConversationsListViewModeFromSearchParams(
	searchParams: URLSearchParams
): ConversationsListViewMode {
	return parseConversationsListViewMode(searchParams.get('view'));
}
