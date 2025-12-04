<script lang="ts">
	import { Badge, cn } from 'flowbite-svelte';
	import type { Component } from 'svelte';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
	import { getFeedbackCriteriaColor } from '$lib/types/conversation/domain/message-feedback-criteria';

	interface Props {
		icon: Component;
		title: string;
		badgeCount: number;
		criteria: MessageFeedbackCriteria;
		iconColor?: string;
	}

	let { icon: Icon, title, badgeCount, criteria, iconColor }: Props = $props();

	const badgeColor = $derived(getFeedbackCriteriaColor(criteria));

	// Map criteria to icon colors (amber for scores, others match badge color)
	const defaultIconColor = $derived(() => {
		if (criteria === 'SCORES') return 'text-amber-500';
		const colorMap: Record<Exclude<MessageFeedbackCriteria, 'SCORES'>, string> = {
			MISTAKES: 'text-red-500',
			STRENGTHS: 'text-green-500',
			VOCABULARY_ENRICHMENT: 'text-blue-500',
			ALTERNATIVE_EXPRESSIONS: 'text-purple-500',
			CULTURAL_NOTE: 'text-indigo-500'
		};
		return colorMap[criteria as Exclude<MessageFeedbackCriteria, 'SCORES'>];
	});

	const finalIconColor = $derived(iconColor ?? defaultIconColor);
</script>

<div class="flex items-center justify-between w-full">
	<div class="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
		<Icon class={cn('w-5 h-5', finalIconColor)} />
		<span>{title}</span>
	</div>
	<Badge color={badgeColor}>{badgeCount}</Badge>
</div>
