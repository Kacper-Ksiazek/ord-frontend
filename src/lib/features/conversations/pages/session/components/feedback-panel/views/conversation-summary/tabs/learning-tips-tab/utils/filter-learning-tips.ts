import type { LearningTipsTabFilters } from '../learning-tips-tab.types';
import type { AggregatedLearningTip } from './aggregate-learning-tips/aggregate-learning-tips.types';

export function filterLearningTips(
	tipsToRender: AggregatedLearningTip[],
	filters: LearningTipsTabFilters
): AggregatedLearningTip[] {
	const { tab, register, searchQuery } = filters;

	return tipsToRender.filter((tip) => {
		const conditions: boolean[] = [];

		// Category filter
		if (tab !== 'ALL') {
			conditions.push(tip.type === tab);
		}

		// Register filter
		if (register !== 'ALL') {
			conditions.push(tip.register === register);
		}

		// Search
		if (searchQuery.trim()) {
			conditions.push(tip.phrase.toLowerCase().includes(searchQuery.trim().toLowerCase()));
		}

		return conditions.every(Boolean);
	});
}
