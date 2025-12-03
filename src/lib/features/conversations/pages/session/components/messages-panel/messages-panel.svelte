<script lang="ts">
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { cn } from 'flowbite-svelte';
	import { AiMessage, InterlocutorDetails, UserMessage } from './components';
	import { getSidepanelContext } from '../../contexts/sidepanel-context.svelte';
	import { getMessagesContext } from '../../contexts/messages-context.svelte';
	import { UserMessageTextarea } from './components/user-message-textarea';

	const sidepanelContext = getSidepanelContext();
	const messagesContext = getMessagesContext();

	$inspect(sidepanelContext);
</script>

<ContentCard
	class={cn(
		sidepanelContext.isOpened && 'w-[70%]', //
		!sidepanelContext.isOpened && 'w-full'
	)}
>
	<div
		class={cn(
			'flex flex-col gap-16 mx-auto h-full', //
			!sidepanelContext.isOpened && 'max-w-[1540px]'
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

		<UserMessageTextarea />
	</div>
</ContentCard>
