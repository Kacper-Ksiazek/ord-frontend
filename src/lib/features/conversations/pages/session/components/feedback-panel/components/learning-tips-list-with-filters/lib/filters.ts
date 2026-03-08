import type { TipRegister, PhraseType } from '$lib/types/ongoing-conversation/api/responses';
import type { LearningTipFilters as SharedLearningTipFilters } from '../../../shared/utils/filter-learning-tips';

export type RegisterFilter = 'ALL' | TipRegister;
export type PhraseTypeFilter = 'ALL' | PhraseType;

// Re-export shared type for consistency
export type LearningTipFilters = SharedLearningTipFilters;
