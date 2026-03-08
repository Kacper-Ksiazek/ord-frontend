import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
import type { AggregatedLearningTip } from '../../../shared/utils/aggregate-learning-tips/aggregate-learning-tips.types';

export function countLearningTips(
	tipsToRender: AggregatedLearningTip[]
): Map<LearningTipCategory, number> {
	let countGrammar = 0;
	let countVocabulary = 0;
	let countPhrases = 0;

	for (const tip of tipsToRender) {
		if (tip.type === 'GRAMMAR') {
			countGrammar++;
		} else if (tip.type === 'VOCABULARY') {
			countVocabulary++;
		} else if (tip.type === 'PHRASES') {
			countPhrases++;
		}
	}

	return new Map([
		['GRAMMAR', countGrammar],
		['VOCABULARY', countVocabulary],
		['PHRASES', countPhrases]
	]);
}
