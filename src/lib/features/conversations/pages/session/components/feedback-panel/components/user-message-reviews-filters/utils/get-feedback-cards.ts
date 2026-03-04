import type { IconCardVariant } from '$lib/components/cards/icon-card';
import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
import { SigmaIcon } from 'lucide-svelte';
import type { FeedbackCategoryFilter } from '../lib/filters';
import { USER_MESSAGE_FEEDBACK_ICONS_MAP } from '$conversations/pages/session/constants/user-message-feedback/icons';

export interface FeedbackCard {
	tabId: FeedbackCategoryFilter;
	title: string;
	variant: IconCardVariant;
	Icon: LucideIcon;
	count: number;
}

interface GetFeedbackCardsProps {
	counts: Map<MessageFeedbackCriteria, number>;
}

export function getFeedbackCards({ counts }: GetFeedbackCardsProps): FeedbackCard[] {
	return [
		{
			tabId: 'ALL',
			title: 'Total',
			variant: 'primary',
			Icon: SigmaIcon,
			count: Array.from(counts.values()).reduce((acc, value) => acc + value, 0)
		},
		{
			tabId: 'MISTAKES',
			title: 'Mistakes',
			variant: 'red',
			Icon: USER_MESSAGE_FEEDBACK_ICONS_MAP.MISTAKES,
			count: counts.get('MISTAKES') ?? 0
		},
		{
			tabId: 'STRENGTHS',
			title: 'Strengths',
			variant: 'green',
			Icon: USER_MESSAGE_FEEDBACK_ICONS_MAP.STRENGTHS,
			count: counts.get('STRENGTHS') ?? 0
		},
		{
			tabId: 'SUGGESTIONS',
			title: 'Suggestions',
			variant: 'blue',
			Icon: USER_MESSAGE_FEEDBACK_ICONS_MAP.SUGGESTIONS,
			count: counts.get('SUGGESTIONS') ?? 0
		}
	];
}
