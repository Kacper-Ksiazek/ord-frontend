import flatMap from 'lodash/flatMap';
import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
import { highlightText, type HighlightPart } from '$lib/utils/text-highlight';

export type { HighlightPart };

export function highlightFeedbackContent(
	content: string,
	feedback: ConversationUserMessageFeedbackDTO
): HighlightPart<MessageFeedbackCriteria>[] {
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
	] as Array<{ text: string; category: MessageFeedbackCriteria }>;

	const priorityMap: Record<MessageFeedbackCriteria, number> = {
		MISTAKES: 5,
		SUGGESTIONS: 4,
		STRENGTHS: 3
	};

	return highlightText(content, highlights, priorityMap);
}
