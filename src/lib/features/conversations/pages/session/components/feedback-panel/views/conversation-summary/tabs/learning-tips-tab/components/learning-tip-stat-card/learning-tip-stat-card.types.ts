import type { TabFilter } from '../../learning-tips-tab.types';

export interface LearningTipStatCardProps {
	count: number;
	tabId: TabFilter;
	isCardActive: boolean;
	onSelect: (tabId: TabFilter) => void;
}
