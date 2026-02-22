import type { LearningTipsTabFilters } from '../learning-tips-tab.types';
import type { AggregatedLearningTip } from './aggregate-learning-tips/aggregate-learning-tips.types';

export function filterLearningTips(
	tipsToRender: AggregatedLearningTip[],
	filters: LearningTipsTabFilters
): AggregatedLearningTip[] {
	const { tab, register, phraseType, searchQuery } = filters;

	const isCategoryFilterApplicable = tab !== 'ALL';
	const isSearchFilterApplicable = searchQuery.trim() !== '';
	const isPhraseTypeFilterApplicable = tab === 'PHRASES' && phraseType !== 'ALL';

	return tipsToRender.filter((tip) => {
		const conditions: boolean[] = [];

		if (isCategoryFilterApplicable) {
			conditions.push(tip.type === tab);
		}

		if (isPhraseTypeFilterApplicable) {
			conditions.push(tip.type === 'PHRASES' && tip.data.phraseType === phraseType);
		}

		// Register filter
		if (register !== 'ALL') {
			conditions.push(tip.register === register);
		}

		// Search
		if (isSearchFilterApplicable) {
			conditions.push(tip.phrase.toLowerCase().includes(searchQuery.trim().toLowerCase()));
		}

		return conditions.every(Boolean);
	});
}
