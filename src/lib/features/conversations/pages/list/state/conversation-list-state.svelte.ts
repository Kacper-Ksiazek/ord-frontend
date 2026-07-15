import isEqual from 'lodash/isEqual';
import { SvelteURLSearchParams } from 'svelte/reactivity';
import type { ConversationType, RecencyBucket } from '$conversations/types';
import type { GetConversationsFilters } from '$conversations/types';

export interface ConversationListFilters {
	search: string;
	recencyBucket: RecencyBucket | null;
	type: ConversationType | null;
}

export class ConversationListFiltersState {
	private static readonly DEFAULT_FILTERS: ConversationListFilters = {
		search: '',
		recencyBucket: null,
		type: null
	};

	filters: ConversationListFilters = $state(ConversationListFiltersState.DEFAULT_FILTERS);

	constructor(urlSearchParams: URLSearchParams) {
		this.applyFromSearchParams(urlSearchParams);
	}

	static parseSearchParams(urlSearchParams: URLSearchParams): ConversationListFilters {
		const rawRecencyBucket = urlSearchParams.get('recencyBucket');
		const rawType = urlSearchParams.get('type');

		return {
			search: urlSearchParams.get('search') ?? '',
			recencyBucket: rawRecencyBucket ? (rawRecencyBucket as RecencyBucket) : null,
			type: rawType ? (rawType as ConversationType) : null
		};
	}

	get hasActiveFilters(): boolean {
		return !isEqual(this.filters, ConversationListFiltersState.DEFAULT_FILTERS);
	}

	get queryPayload(): GetConversationsFilters {
		const payload: GetConversationsFilters = {};

		if (this.filters.search) {
			payload.search = this.filters.search;
		}
		if (this.filters.recencyBucket) {
			payload.recencyBucket = this.filters.recencyBucket;
		}
		if (this.filters.type) {
			payload.type = this.filters.type;
		}

		return payload;
	}

	applyFromSearchParams(urlSearchParams: URLSearchParams) {
		const next = ConversationListFiltersState.parseSearchParams(urlSearchParams);
		if (!isEqual(this.filters, next)) {
			this.filters = next;
		}
	}

	toSearchParams(): URLSearchParams {
		const params = new SvelteURLSearchParams();

		if (this.filters.search) {
			params.set('search', this.filters.search);
		}
		if (this.filters.recencyBucket) {
			params.set('recencyBucket', this.filters.recencyBucket);
		}
		if (this.filters.type) {
			params.set('type', this.filters.type);
		}

		return params;
	}

	matchesSearchParams(urlSearchParams: URLSearchParams): boolean {
		return isEqual(this.filters, ConversationListFiltersState.parseSearchParams(urlSearchParams));
	}

	clearFilters() {
		this.filters = ConversationListFiltersState.DEFAULT_FILTERS;
	}
}
