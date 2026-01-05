import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
import { CircleAlert, CircleCheck, Lightbulb } from 'lucide-svelte';

export const USER_MESSAGE_FEEDBACK_ICONS_MAP: Record<MessageFeedbackCriteria, LucideIcon> = {
	MISTAKES: CircleAlert,
	STRENGTHS: CircleCheck,
	SUGGESTIONS: Lightbulb
};
