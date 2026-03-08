import type { IconCardVariant } from '$lib/components/cards/icon-card';
import { SigmaIcon } from 'lucide-svelte';
import type { LearningTipCategoryFilter } from '../../../shared/utils/filter-learning-tips';
import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$conversations/pages/session/constants/ai-message-learning-tips/icons';
import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';

export interface LearningTipCard {
	tabId: LearningTipCategoryFilter;
	title: string;
	variant: IconCardVariant;
	Icon: LucideIcon;
	count: number;
}

interface GetLearningTipCardsProps {
	counts: Map<LearningTipCategory, number>;
}

export function getLearningTipCards({ counts }: GetLearningTipCardsProps): LearningTipCard[] {
	return [
		{
			tabId: 'ALL',
			title: 'Total',
			variant: 'primary',
			Icon: SigmaIcon,
			count: Array.from(counts.values()).reduce((acc, value) => acc + value, 0)
		},
		{
			tabId: 'GRAMMAR',
			title: 'Grammar',
			variant: 'green',
			Icon: AI_MESSAGE_LEARNING_TIP_ICONS_MAP.GRAMMAR,
			count: counts.get('GRAMMAR') ?? 0
		},
		{
			tabId: 'VOCABULARY',
			title: 'Vocabulary',
			variant: 'blue',
			Icon: AI_MESSAGE_LEARNING_TIP_ICONS_MAP.VOCABULARY,
			count: counts.get('VOCABULARY') ?? 0
		},
		{
			tabId: 'PHRASES',
			title: 'Phrases',
			variant: 'purple',
			Icon: AI_MESSAGE_LEARNING_TIP_ICONS_MAP.PHRASES,
			count: counts.get('PHRASES') ?? 0
		}
	];
}
