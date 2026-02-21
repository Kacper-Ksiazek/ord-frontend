import type { FeedbackTabFilters } from '../feedback-tab.types';
import type { AggregatedFeedbackItem } from './aggregate-feedback/aggregate-feedback.types';

export function filterFeedback(
	items: AggregatedFeedbackItem[],
	filters: FeedbackTabFilters
): AggregatedFeedbackItem[] {
	const { tab, severity, suggestionType, searchQuery } = filters;

	const isCategoryFilterApplicable = tab !== 'ALL';
	const isSearchFilterApplicable = searchQuery.trim() !== '';
	const isMistakeSeverityFilterApplicable = tab === 'MISTAKES' && severity !== 'ALL';
	const isSuggestionTypeFilterApplicable = tab === 'SUGGESTIONS' && suggestionType !== 'ALL';

	return items.filter((item) => {
		const conditions: boolean[] = [];

		if (isCategoryFilterApplicable) {
			conditions.push(item.type === tab);
		}

		if (isMistakeSeverityFilterApplicable) {
			conditions.push(item.type === 'MISTAKES' && item.data.severity === severity);
		}

		if (isSuggestionTypeFilterApplicable) {
			conditions.push(item.type === 'SUGGESTIONS' && item.data.suggestionType === suggestionType);
		}

		if (isSearchFilterApplicable) {
			conditions.push(item.searchableText.includes(searchQuery.trim().toLowerCase()));
		}

		return conditions.every(Boolean);
	});
}
