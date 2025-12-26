<script lang="ts">
	import { Badge, cn } from 'flowbite-svelte';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
	import { getFeedbackCriteriaColor } from '$lib/types/conversation/domain/message-feedback-criteria';
	import FeedbackMetricIcon from '../../shared/feedback-metric-icon.svelte';
	import { getLeadingColorForFeedbackMetric } from '../../../utils/get-leading-color-for-feedback-metric';

	interface Props {
		title: string;
		badgeCount: number;
		criteria: MessageFeedbackCriteria;
		iconColor?: string;
	}

	let { title, badgeCount, criteria, iconColor }: Props = $props();

	const badgeColor = $derived(getFeedbackCriteriaColor(criteria));
	const defaultIconColor = $derived(getLeadingColorForFeedbackMetric(criteria));
	const finalIconColor = $derived(iconColor ?? defaultIconColor);
</script>

<div class="flex items-center justify-between w-full">
	<div class="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
		<FeedbackMetricIcon {criteria} class={cn('w-5 h-5', finalIconColor)} />
		<span>{title}</span>
	</div>
	<Badge color={badgeColor}>{badgeCount}</Badge>
</div>
