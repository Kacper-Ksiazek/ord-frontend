import { describe, expect, it } from 'vitest';
import { ConversationListFiltersState } from './conversation-list-state.svelte';

describe('ConversationListFiltersState', () => {
	it('seeds filters from URL search params', () => {
		const state = new ConversationListFiltersState(
			new URLSearchParams('search=hello&recencyBucket=TODAY&type=SMALL_TALK')
		);

		expect(state.filters).toEqual({
			search: 'hello',
			recencyBucket: 'TODAY',
			type: 'SMALL_TALK'
		});
	});

	it('ignores unknown recencyBucket and type query values', () => {
		const state = new ConversationListFiltersState(
			new URLSearchParams('search=hello&recencyBucket=FOO&type=NOT_A_TYPE')
		);

		expect(state.filters).toEqual({
			search: 'hello',
			recencyBucket: null,
			type: null
		});
		expect(state.queryPayload).toEqual({ search: 'hello' });
	});

	it('serializes active filters back to search params', () => {
		const state = new ConversationListFiltersState(new URLSearchParams());
		state.filters = {
			search: 'topic',
			recencyBucket: 'THIS_WEEK',
			type: null
		};

		expect(state.toQueryString()).toBe('search=topic&recencyBucket=THIS_WEEK');
	});

	it('serializes in-place search mutations without replacing the filters object', () => {
		const state = new ConversationListFiltersState(new URLSearchParams());
		const other = new ConversationListFiltersState(new URLSearchParams());

		state.filters.search = 'alpha';

		expect(state.toQueryString()).toBe('search=alpha');
		expect(state.hasActiveFilters).toBe(true);
		expect(other.filters.search).toBe('');
		expect(other.hasActiveFilters).toBe(false);
	});

	it('matches URL search params after apply', () => {
		const state = new ConversationListFiltersState(new URLSearchParams());
		const params = new URLSearchParams('type=EXAM_PRACTICE');

		state.applyFromSearchParams(params);

		expect(state.matchesSearchParams(params)).toBe(true);
		expect(state.matchesSearchParams(new URLSearchParams())).toBe(false);
	});

	it('matches URL search params after in-place search mutation', () => {
		const state = new ConversationListFiltersState(new URLSearchParams());

		state.filters.search = 'alpha';

		expect(state.matchesSearchParams(new URLSearchParams('search=alpha'))).toBe(true);
		expect(state.matchesSearchParams(new URLSearchParams())).toBe(false);
	});
});
