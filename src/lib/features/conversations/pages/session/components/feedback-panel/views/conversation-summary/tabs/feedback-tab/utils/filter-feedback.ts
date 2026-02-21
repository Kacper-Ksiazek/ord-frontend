import type { FeedbackTabFilters } from '../feedback-tab.types';
import type { AggregatedFeedbackItem } from './aggregate-feedback/aggregate-feedback.types';

export function filterFeedback(
	items: AggregatedFeedbackItem[],
	filters: FeedbackTabFilters
): AggregatedFeedbackItem[] {
	const { tab, severity, searchQuery } = filters;

	const isCategoryFilterApplicable = tab !== 'ALL';
	const isSearchFilterApplicable = searchQuery.trim() !== '';
	const isMistakeSeverityFilterApplicable = tab === 'MISTAKES' && severity !== 'ALL';

	return items.filter((item) => {
		const conditions: boolean[] = [];

		if (isCategoryFilterApplicable) {
			conditions.push(item.type === tab);
		}

		if (isMistakeSeverityFilterApplicable) {
			conditions.push(item.type === 'MISTAKES' && item.data.severity === severity);
		}

		if (isSearchFilterApplicable) {
			conditions.push(item.searchableText.includes(searchQuery.trim().toLowerCase()));
		}

		if (conditions.every(Boolean)) {
			console.log({ item, conditions });
		}

		return conditions.every(Boolean);
	});
}
