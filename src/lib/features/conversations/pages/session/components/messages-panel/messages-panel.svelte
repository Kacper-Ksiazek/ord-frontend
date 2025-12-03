<script lang="ts">
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { cn } from 'flowbite-svelte';
	import { AiMessage, InterlocutorDetails, UserMessage } from './components';
	import { getSidepanelContext } from '../../contexts/sidepanel-context.svelte';
	import { getMessagesContext } from '../../contexts/messages-context.svelte';

	const { isOpened: isSidepanelOpened } = getSidepanelContext();
	const messagesContext = getMessagesContext();
</script>

<ContentCard
	class={cn(
		isSidepanelOpened && 'w-[70%]', //
		!isSidepanelOpened && 'w-full'
	)}
>
	<div
		class={cn(
			'flex flex-col gap-16 mx-auto h-full', //
			!isSidepanelOpened && 'max-w-[1540px]'
		)}
	>
		<InterlocutorDetails />

		{#each messagesContext.messages as message, index}
			{#if message.sender === 'AI'}
				{@const isLastMessage = index === messagesContext.messages.length - 1}

				<AiMessage
					message={message.content}
					isStillGenerating={isLastMessage && messagesContext.isGenerating}
				/>
			{/if}

			{#if message.sender === 'USER'}
				<UserMessage {message} />
			{/if}
		{/each}

		<span class="grow"></span>

		<textarea class="w-full"></textarea>
	</div>
</ContentCard>
