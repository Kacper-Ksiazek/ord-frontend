<script lang="ts">
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import {
		conversationStore,
		conversationMessagesStore,
		conversationSidepanelStore
	} from '../../stores';
	import { cn } from 'flowbite-svelte';
	import { AiMessage, InterlocutorDetails, UserMessage } from './components';

	const isSidepanelOpened = $derived(conversationSidepanelStore.isSidepanelOpened);
	const conversation = $derived(conversationStore.conversation);
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

		{#each conversationMessagesStore.messages as message, index}
			{#if message.sender === 'AI'}
				{@const isLastMessage = index === conversationMessagesStore.messages.length - 1}

				<AiMessage
					message={message.content}
					isStillGenerating={isLastMessage && conversationMessagesStore.isGenerating}
					interlocutor={{
						aiInterlocutorAvatarId: conversation.aiInterlocutorAvatarId,
						aiInterlocutorName: conversation.aiInterlocutorName
					}}
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
