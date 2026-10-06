import { describe, expect, it } from 'vitest';
import {
	buildConversationsListQueryString,
	parseConversationsListViewMode,
	parseConversationsListViewModeFromSearchParams
} from './conversations-list-url-state';

describe('conversations-list-url-state', () => {
	it('defaults view mode to list', () => {
		expect(parseConversationsListViewMode(null)).toBe('list');
		expect(parseConversationsListViewMode('list')).toBe('list');
	});

	it('parses summary view mode', () => {
		expect(parseConversationsListViewMode('summary')).toBe('summary');
		expect(parseConversationsListViewModeFromSearchParams(new URLSearchParams('view=summary'))).toBe(
			'summary'
		);
	});

	it('omits view param for list', () => {
		expect(buildConversationsListQueryString('search=hi', 'list')).toBe('search=hi');
		expect(buildConversationsListQueryString('', 'list')).toBe('');
	});

	it('includes view=summary when active', () => {
		expect(buildConversationsListQueryString('search=hi', 'summary')).toBe('search=hi&view=summary');
		expect(buildConversationsListQueryString('', 'summary')).toBe('view=summary');
	});
});
