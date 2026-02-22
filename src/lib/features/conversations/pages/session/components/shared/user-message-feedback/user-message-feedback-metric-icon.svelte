<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
	import { USER_MESSAGE_FEEDBACK_ICONS_MAP } from '$conversations/pages/session/constants/user-message-feedback/icons';
	import { getUserMessageFeedbackColors } from '$conversations/pages/session/constants/user-message-feedback/colors';

	interface Props {
		criteria: MessageFeedbackCriteria;
		class?: string;
	}

	const { criteria, class: className }: Props = $props();

	const Icon = $derived(USER_MESSAGE_FEEDBACK_ICONS_MAP[criteria]);
</script>

<Icon
	class={cn(
		getUserMessageFeedbackColors(criteria).text, //
		className
	)}
/>
