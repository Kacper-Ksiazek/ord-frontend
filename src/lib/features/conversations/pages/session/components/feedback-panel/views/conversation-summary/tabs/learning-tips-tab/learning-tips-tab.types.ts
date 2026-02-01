import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
import type { TipRegister } from '$lib/types/ongoing-conversation/api/responses';

export type RegisterFilter = 'ALL' | TipRegister;
export type TabFilter = 'ALL' | LearningTipCategory;

export interface LearningTipsTabFilters {
	register: RegisterFilter;
	tab: TabFilter;
	searchQuery: string;
}
