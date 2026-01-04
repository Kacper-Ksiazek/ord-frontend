<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
	import { CircleCheck, CircleAlert, Lightbulb } from 'lucide-svelte';
	import { getLeadingColorForFeedbackMetric } from '../../utils/get-leading-color-for-feedback-metric';

	interface Props {
		criteria: MessageFeedbackCriteria;
		class?: string;
	}

	const { criteria, class: className }: Props = $props();

	const iconMap: Record<MessageFeedbackCriteria, LucideIcon> = {
		MISTAKES: CircleAlert,
		STRENGTHS: CircleCheck,
		SUGGESTIONS: Lightbulb
	};

	const Icon = $derived(iconMap[criteria]);
</script>

<Icon
	class={cn(
		getLeadingColorForFeedbackMetric(criteria), //
		className
	)}
/>
