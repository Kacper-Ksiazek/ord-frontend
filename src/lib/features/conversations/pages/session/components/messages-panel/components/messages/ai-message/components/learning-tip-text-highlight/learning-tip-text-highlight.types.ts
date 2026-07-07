import type { AIMessageLearningTips } from '$conversations/types/ongoing-conversation/api/responses';
import type { LearningTipCategory } from '$conversations/types/domain/learning-tip-category';

export interface LearningTipTextHighlightProps {
	id: string;
	highlightType: LearningTipCategory;
	highlightedText: string;
	learningTips: AIMessageLearningTips;
	showIconsInHighlightedParts: boolean;
}
