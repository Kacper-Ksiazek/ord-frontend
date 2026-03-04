import type { UserMessageReviewFilters } from './filters';

export const DEFAULT_FEEDBACK_FILTERS: UserMessageReviewFilters = {
	category: 'ALL',
	mistakeSeverity: 'ALL',
	suggestionType: 'ALL',
	searchQuery: ''
};
