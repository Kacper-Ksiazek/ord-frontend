import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
import type { LearningTipStatCardProps } from '../components/learning-tip-stat-card/learning-tip-stat-card.types';

export function getLearningTipCards(
	learningTipsCounts: Map<LearningTipCategory, number>
): Pick<LearningTipStatCardProps, 'count' | 'tabId'>[] {
	return [
		{
			tabId: 'ALL',
			count: learningTipsCounts.values().reduce((acc, value) => acc + value, 0)
		},
		{
			tabId: 'GRAMMAR',
			count: learningTipsCounts.get('GRAMMAR') ?? 0
		},
		{
			tabId: 'VOCABULARY',
			count: learningTipsCounts.get('VOCABULARY') ?? 0
		},
		{
			tabId: 'PHRASES',
			count: learningTipsCounts.get('PHRASES') ?? 0
		}
	];
}
