<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
	import { getLeadingColorForFeedbackMetric } from '../../utils/get-leading-color-for-feedback-metric';
	import { USER_MESSAGE_FEEDBACK_ICONS_MAP } from '../../consts/user-message-feedback/icons';

	interface Props {
		criteria: MessageFeedbackCriteria;
		class?: string;
	}

	const { criteria, class: className }: Props = $props();

	const Icon = $derived(USER_MESSAGE_FEEDBACK_ICONS_MAP[criteria]);
</script>

<Icon
	class={cn(
		getLeadingColorForFeedbackMetric(criteria), //
		className
	)}
/>
