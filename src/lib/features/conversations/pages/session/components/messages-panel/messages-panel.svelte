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

<div
	class={cn('bg-transparent transition-[width] duration-300 origin-left relative p-0')}
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
			'flex flex-col mx-auto h-full', //
			!sidepanelContext.isOpened && 'w-full'
		)}
	>
		<!-- Scrollable messages area -->
		<div class="flex-1 overflow-y-auto flex flex-col gap-16 px-4 py-8 relative">
			<div
				class={cn(
					'flex flex-col gap-16 max-w-[1200px] w-full', //
					'absolute top-0 left-1/2 -translate-x-1/2'
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
			</div>
		</div>

		<!-- Fixed textarea at bottom -->
		<UserMessageTextarea />
	</div>
</div>
