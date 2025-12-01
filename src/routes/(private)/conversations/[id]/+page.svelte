<script lang="ts">
	import { createConversationQuery } from '$lib/api-client/conversation/queries';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import { page } from '$app/state';
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { InterlocutorDetails } from '$lib/features/conversations/pages/session/components';
	import { cn } from 'flowbite-svelte';
	import { conversationMessagesStore } from '$lib/features/conversations/pages/session/stores/conversation-messages.svelte';
	import {
		UserMessage,
		AiMessage
	} from '$lib/features/conversations/pages/session/components/messages';
	import ConversationTypeIcon from '$lib/features/conversations/shared/components/conversation-type-icon.svelte';

	const conversationQuery = createConversationQuery(page.params.id);

	const conversation = $derived(conversationQuery.data);
	const isLoading = $derived(conversationQuery.isLoading);
	const isError = $derived(conversationQuery.isError);
	const error = $derived(conversationQuery.error);

	const jsonString = $derived(conversation ? JSON.stringify(conversation, null, 2) : null);

	let isSidepanelOpened = $state(false);
</script>

<svelte:head>
	<title>Conversation {page.params.id}</title>
</svelte:head>

{#if !conversation}
	<!--  -->
{:else}
	<PageContentContainer layout="superwide">
		{#snippet header()}
			<!-- <ConversationDetails {conversation} /> -->
			<button onclick={() => (isSidepanelOpened = !isSidepanelOpened)}>
				{#if isSidepanelOpened}
					Close Sidepanel
				{:else}
					Open Sidepanel
				{/if}
			</button>
		{/snippet}

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
				<InterlocutorDetails {conversation} />

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

		<ContentCard
			class={cn(
				isSidepanelOpened && 'w-[30%]', //
				!isSidepanelOpened && 'w-0 overflow-hidden scale-x-0 hidden'
			)}
		>
			<h2>Conversation Details</h2>
		</ContentCard>
	</PageContentContainer>
{/if}
