<script lang="ts">
	import { AccordionItem, Badge, cn } from 'flowbite-svelte';
	import FeedbackMetricIcon from '../../../shared/feedback-metric-icon.svelte';
	import { getLeadingColorForFeedbackMetric } from '../../../../utils/get-leading-color-for-feedback-metric';
	import { getFeedbackCriteriaColor } from '$lib/types/conversation/domain/message-feedback-criteria';
	import type { AccordionItemProps } from './accordion-item.interface';
	import {
		getHoverBackgroundColor,
		getActiveBackgroundColor
	} from '$lib/features/conversations/pages/session/utils/get-user-message-feedback-colors';

	let {
		criteria,
		title,
		badgeCount,
		open = $bindable(false),
		class: className = '',
		children
	}: AccordionItemProps = $props();

	const headerClass = $derived(
		cn(
			'px-4 py-2 transition-colors',
			'focus:outline-none focus:ring-0 focus-visible:outline-none',
			getHoverBackgroundColor(criteria),
			open && getActiveBackgroundColor(criteria),
			className
		)
	);

	const iconColor = $derived(getLeadingColorForFeedbackMetric(criteria));
	const badgeColor = $derived(getFeedbackCriteriaColor(criteria));
</script>

<AccordionItem bind:open {headerClass}>
	{#snippet header()}
		<div class="flex items-center justify-between w-full -mx-3 px-3">
			<div class="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100 py-2">
				<FeedbackMetricIcon {criteria} class={cn('w-5 h-5', iconColor)} />
				<span>{title}</span>
			</div>
			<Badge color={badgeColor}>{badgeCount}</Badge>
		</div>
	{/snippet}
	{@render children()}
</AccordionItem>
