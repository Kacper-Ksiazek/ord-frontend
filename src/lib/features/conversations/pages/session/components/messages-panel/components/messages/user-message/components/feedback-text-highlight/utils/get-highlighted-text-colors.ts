import { cn } from 'flowbite-svelte';
import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';

export function getHighlightedTextColors(highlightType: MessageFeedbackCriteria): string {
	switch (highlightType) {
		case 'MISTAKES':
			return cn(
				'bg-red-200/50 text-red-900 hover:bg-red-300/70',
				'dark:bg-red-900/70 dark:text-red-100 dark:hover:bg-red-600'
			);

		case 'SUGGESTIONS':
			return cn(
				'bg-blue-200/50 text-blue-900 hover:bg-blue-300/70',
				'dark:bg-blue-900/70 dark:text-blue-100 dark:hover:bg-blue-600'
			);

		case 'STRENGTHS':
			return cn(
				'bg-green-200/50 text-green-900 hover:bg-green-300/70',
				'dark:bg-green-900/70 dark:text-green-100 dark:hover:bg-green-600'
			);

		default:
			return '' as never;
	}
}
