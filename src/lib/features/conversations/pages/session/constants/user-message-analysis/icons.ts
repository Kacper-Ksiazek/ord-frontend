import type { MessageAnalysisCriteria } from '$conversations/types/domain/message-analysis-criteria';
import { CircleAlert, Lightbulb, ThumbsUp } from 'lucide-svelte';

export const USER_MESSAGE_ANALYSIS_ICONS_MAP: Record<MessageAnalysisCriteria, LucideIcon> = {
	MISTAKES: CircleAlert,
	STRENGTHS: ThumbsUp,
	SUGGESTIONS: Lightbulb
};
