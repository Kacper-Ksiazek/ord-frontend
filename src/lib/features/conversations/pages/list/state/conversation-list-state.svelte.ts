import isEqual from 'lodash/isEqual';
import type { ConversationListFilters } from '../conversation-list-url';
import type { ConversationType, RecencyBucket } from '$lib/types/conversation/domain/conversation';
import type { GetConversationsFilters } from '$lib/types/conversation/api/list-conversations';

export class ConversationListFiltersState {
	private static readonly DEFAULT_FILTERS: ConversationListFilters = {
		search: '',
		recencyBucket: null,
		type: null
	};

	filters: ConversationListFilters = $state(ConversationListFiltersState.DEFAULT_FILTERS);

	constructor(urlSearchParams: URLSearchParams) {
		const rawRecencyBucket = urlSearchParams.get('recencyBucket');
		const rawType = urlSearchParams.get('type');

		this.filters = {
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

	clearFilters() {
		this.filters = ConversationListFiltersState.DEFAULT_FILTERS;
	}
}
