import { SvelteMap } from 'svelte/reactivity';
import type { ConversationType } from '$lib/types/conversation/domain/conversation';

/** When true, the chosen topic is the manual field only; list rows cannot be selected. */
export const topicPickerUi = $state({
	useOwnTopic: false
});

export function resetTopicPickerCustomState() {
	topicPickerUi.useOwnTopic = false;
}

export const topics = new SvelteMap<ConversationType, string[]>([
	[
		'SMALL_TALK',
		[
			"What's your favorite way to spend a weekend?",
			'Have you seen any good movies lately?',
			'If you could travel anywhere, where would you go?'
		]
	]
]);
