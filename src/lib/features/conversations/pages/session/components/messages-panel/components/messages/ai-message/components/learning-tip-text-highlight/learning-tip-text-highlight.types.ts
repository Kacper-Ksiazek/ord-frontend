import type { AIMessageLearningTips } from '$lib/types/ongoing-conversation/api/responses';
import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';

export interface LearningTipTextHighlightProps {
	id: string;
	highlightType: LearningTipCategory;
	highlightedText: string;
	learningTips: AIMessageLearningTips;
	showIconsInHighlightedParts: boolean;
}
