import flatMap from 'lodash/flatMap';
import type { ConversationUserMessageAnalysisDTO } from '$conversations/types/domain/conversation-message-analysis';
import type { MessageAnalysisCriteria } from '$conversations/types/domain/message-analysis-criteria';
import { highlightText, type HighlightPart } from '$lib/utils/text/highlight-segments';

export type { HighlightPart };

export function highlightAnalysisContent(
	content: string,
	feedback: ConversationUserMessageAnalysisDTO
): HighlightPart<MessageAnalysisCriteria>[] {
	if (!feedback || !content) return [{ text: content }];

	const highlights = [
		...flatMap(feedback.mistakes ?? [], (m) =>
			m.phrase?.trim() ? [{ text: m.phrase, category: 'MISTAKES' as const }] : []
		),
		...flatMap(feedback.strengths ?? [], (s) =>
			s.phrase?.trim() ? [{ text: s.phrase, category: 'STRENGTHS' as const }] : []
		),
		...flatMap(feedback.suggestions ?? [], (s) =>
			s.original?.trim() ? [{ text: s.original, category: 'SUGGESTIONS' as const }] : []
		)
	] as Array<{ text: string; category: MessageAnalysisCriteria }>;

	const priorityMap: Record<MessageAnalysisCriteria, number> = {
		MISTAKES: 5,
		SUGGESTIONS: 4,
		STRENGTHS: 3
	};

	return highlightText(content, highlights, priorityMap);
}
