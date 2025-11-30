import { SvelteMap } from 'svelte/reactivity';
import type { ConversationType } from '$lib/types/conversation/domain/conversation';

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
