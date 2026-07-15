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

	it('serializes active filters back to search params', () => {
		const state = new ConversationListFiltersState(new URLSearchParams());
		state.filters = {
			search: 'topic',
			recencyBucket: 'THIS_WEEK',
			type: null
		};

		expect(state.toSearchParams().toString()).toBe('search=topic&recencyBucket=THIS_WEEK');
	});

	it('matches URL search params after apply', () => {
		const state = new ConversationListFiltersState(new URLSearchParams());
		const params = new URLSearchParams('type=EXAM_PRACTICE');

		state.applyFromSearchParams(params);

		expect(state.matchesSearchParams(params)).toBe(true);
		expect(state.matchesSearchParams(new URLSearchParams())).toBe(false);
	});
});
