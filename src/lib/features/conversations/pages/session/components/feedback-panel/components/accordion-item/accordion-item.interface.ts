import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
import type { Snippet } from 'svelte';

export interface AccordionItemProps {
	criteria: MessageFeedbackCriteria;
	title: string;
	badgeCount: number;
	open?: boolean;
	class?: string;
	children: Snippet;
}

