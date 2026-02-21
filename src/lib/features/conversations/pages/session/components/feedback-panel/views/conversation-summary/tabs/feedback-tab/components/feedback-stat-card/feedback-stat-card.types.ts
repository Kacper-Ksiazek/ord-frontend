import type { FeedbackTabFilter } from '../../feedback-tab.types';

export interface FeedbackStatCardProps {
	count: number;
	tabId: FeedbackTabFilter;
	isCardActive: boolean;
	onSelect: (tabId: FeedbackTabFilter) => void;
}
