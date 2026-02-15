<script lang="ts">
	import { AccordionItem, Badge, cn } from 'flowbite-svelte';
	import FeedbackMetricIcon from '../../../shared/user-message-feedback/user-message-feedback-metric-icon.svelte';
	import type { AccordionItemProps } from './accordion-item.interface';
	import { getUserMessageFeedbackColors } from '$lib/features/conversations/pages/session/consts/user-message-feedback/colors';

	let {
		criteria,
		title,
		badgeCount,
		open = $bindable(false),
		class: className = '',
		children
	}: AccordionItemProps = $props();

	const colors = getUserMessageFeedbackColors(criteria);

	const headerClass = $derived(
		cn(
			'px-4 py-2 transition-colors',
			'focus:outline-none focus:ring-0 focus-visible:outline-none',
			colors.hover,
			open && colors.active,
			className
		)
	);
</script>

<AccordionItem bind:open {headerClass}>
	{#snippet header()}
		<div class="flex items-center justify-between w-full -mx-3 px-3">
			<div class="flex items-center gap-2 text-emphasis py-2">
				<FeedbackMetricIcon {criteria} class={cn('w-5 h-5', colors.text)} />
				<span>{title}</span>
			</div>

			<Badge color={colors.twColor}>{badgeCount}</Badge>
		</div>
	{/snippet}

	{@render children()}
</AccordionItem>
