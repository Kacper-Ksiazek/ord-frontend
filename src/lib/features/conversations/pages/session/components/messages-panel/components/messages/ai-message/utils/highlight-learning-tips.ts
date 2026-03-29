import flatMap from 'lodash/flatMap';
import type { AIMessageLearningTips } from '$lib/types/ongoing-conversation/api/responses';
import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
import { highlightText, type HighlightPart } from '$lib/utils/text/highlight-segments';

export function highlightLearningTipsContent(
	content: string,
	learningTips: AIMessageLearningTips
): HighlightPart<LearningTipCategory>[] {
	if (!learningTips || !content) {
		return [{ text: content }];
	}

	const highlights = [
		...flatMap(learningTips.grammarTips ?? [], (tip) =>
			tip.phrase?.trim() ? [{ text: tip.phrase, category: 'GRAMMAR' }] : []
		),
		...flatMap(learningTips.vocabularyTips ?? [], (tip) =>
			tip.word?.trim() ? [{ text: tip.word, category: 'VOCABULARY' }] : []
		),
		...flatMap(learningTips.phraseTips ?? [], (tip) =>
			tip.phrase?.trim() ? [{ text: tip.phrase, category: 'PHRASES' }] : []
		)
	] as { text: string; category: LearningTipCategory }[];

	return highlightText(content, highlights);
}
