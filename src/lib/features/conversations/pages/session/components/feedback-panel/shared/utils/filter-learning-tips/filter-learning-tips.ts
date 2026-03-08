import type { AggregatedLearningTip } from '../aggregate-learning-tips/aggregate-learning-tips.types';
import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';

export type LearningTipCategoryFilter = 'ALL' | LearningTipCategory;

export interface LearningTipFilters {
	category: LearningTipCategoryFilter;
	register: 'ALL' | 'FORMAL' | 'NEUTRAL' | 'COLLOQUIAL';
	phraseType: 'ALL' | 'LITERAL' | 'IDIOMATIC';
	searchQuery: string;
}

export function filterLearningTips(
	tipsToRender: AggregatedLearningTip[],
	filters: LearningTipFilters
): AggregatedLearningTip[] {
	const { category, register, phraseType, searchQuery } = filters;

	const isCategoryFilterApplicable = category !== 'ALL';
	const isSearchFilterApplicable = searchQuery.trim() !== '';
	const isPhraseTypeFilterApplicable = phraseType !== 'ALL';

	return tipsToRender.filter((tip) => {
		const conditions: boolean[] = [];

		if (isCategoryFilterApplicable) {
			conditions.push(tip.type === category);
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
			conditions.push(tip.searchableText.includes(searchQuery.trim().toLowerCase()));
		}

		return conditions.every(Boolean);
	});
}
