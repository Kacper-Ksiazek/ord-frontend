import type { UserMessageReviewFilters } from '$conversations/pages/session/components/feedback-panel/components/user-message-reviews-list-with-filters/lib/filters';
import type { AggregatedFeedbackItem } from '../aggregate-feedback/aggregate-feedback.types';

export function filterUserMessageReviews(
	items: AggregatedFeedbackItem[],
	filters: UserMessageReviewFilters
): AggregatedFeedbackItem[] {
	const { category: tab, mistakeSeverity: severity, suggestionType, searchQuery } = filters;

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
