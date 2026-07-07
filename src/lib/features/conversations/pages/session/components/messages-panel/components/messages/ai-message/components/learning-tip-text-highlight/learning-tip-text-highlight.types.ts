import type { AIMessageLearningTips } from '$conversations/types';
import type { LearningTipCategory } from '$conversations/types';

export interface LearningTipTextHighlightProps {
	id: string;
	highlightType: LearningTipCategory;
	highlightedText: string;
	learningTips: AIMessageLearningTips;
	showIconsInHighlightedParts: boolean;
}
