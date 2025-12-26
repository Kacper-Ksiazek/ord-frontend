<script lang="ts">
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { ArrowRightOutline, CloseOutline } from 'flowbite-svelte-icons';
	import { cn, Tooltip } from 'flowbite-svelte';
	import { getSidepanelContext } from '$lib/features/conversations/pages/session/contexts/sidepanel-context.svelte';

	interface ToggleSidepanelButtonProps {
		isSelected: boolean;
		feedback: ConversationUserMessageFeedbackDTO;
	}

	const { isSelected, feedback }: ToggleSidepanelButtonProps = $props();
	const sidepanelContext = getSidepanelContext();

	function handleClick() {
		if (isSelected) {
			sidepanelContext.isOpened = false;
			sidepanelContext.feedbackPreview = null;
			return;
		}

		sidepanelContext.isOpened = true;
		sidepanelContext.feedbackPreview = feedback;
	}
</script>

<button
	onclick={handleClick}
	class={cn(
		'absolute top-3 right-3',
		'flex items-center p-1 rounded-md text-primary-700 transition-transform', //
		'hover:scale-120'
	)}
>
	{#if isSelected}
		<CloseOutline class="transition-all duration-300 w-6 h-6" />
	{:else}
		<ArrowRightOutline class="transition-all duration-300 w-6 h-6" />
	{/if}
</button>

<Tooltip placement="left" trigger="hover">
	{isSelected ? 'Zamknij podgląd' : 'Otwórz podgląd'}
</Tooltip>
