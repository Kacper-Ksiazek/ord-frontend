<script lang="ts">
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { cn } from 'flowbite-svelte';
	import { AiMessage, InterlocutorDetails, StickyActionButton, UserMessage } from './components';
	import { getSidepanelContext } from '../../contexts/sidepanel-context.svelte';
	import { getMessagesContext } from '../../contexts/messages-context.svelte';
	import { UserMessageTextarea } from './components/user-message-textarea';
	import { SIDEPANEL_WIDTH } from '../constants';
	import { WindowSolid, ColumnSolid, ChevronLeftOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';

	const sidepanelContext = getSidepanelContext();
	const messagesContext = getMessagesContext();
</script>

<ContentCard
	class={cn('bg-transparent transition-[width] duration-300 origin-left relative pt-0')}
	style={sidepanelContext.isOpened ? `width: calc(100% - ${SIDEPANEL_WIDTH}px)` : 'width: 100%'}
>
	<!-- Back Button -->
	<StickyActionButton
		icon={ChevronLeftOutline}
		onclick={() => goto('/conversations')}
		ariaLabel="Go back"
		title="Go back"
		position="left"
	/>

	<!-- Layout Toggle Button -->
	<StickyActionButton
		icon={sidepanelContext.isOpened ? WindowSolid : ColumnSolid}
		onclick={() => (sidepanelContext.isOpened = !sidepanelContext.isOpened)}
		ariaLabel={sidepanelContext.isOpened ? 'Switch to full width layout' : 'Switch to split layout'}
		title={sidepanelContext.isOpened ? 'Switch to full width layout' : 'Switch to split layout'}
		position="right"
	/>

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
