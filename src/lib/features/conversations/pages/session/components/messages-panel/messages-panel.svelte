<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { AiMessage, InterlocutorDetails, TopActionButton, UserMessage } from './components';
	import { getSidepanelContext } from '../../contexts/sidepanel-context.svelte';
	import { getMessagesContext } from '../../contexts/messages-context.svelte';
	import { UserMessageTextarea } from './components/user-message-textarea';
	import { SIDEPANEL_WIDTH } from '../constants';
	import { WindowSolid, ColumnSolid, ChevronLeftOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';

	const sidepanelContext = getSidepanelContext();
	const messagesContext = getMessagesContext();
</script>

<div
	class={cn('bg-transparent transition-[width] duration-300 origin-left relative p-0')}
	style={sidepanelContext.isOpened ? `width: calc(100% - ${SIDEPANEL_WIDTH}px)` : 'width: 100%'}
>
	<!-- Back Button -->
	<TopActionButton
		icon={ChevronLeftOutline}
		onclick={() => goto('/conversations')}
		ariaLabel="Go back"
		title="Go back"
		position="left"
	/>

	<!-- Layout Toggle Button -->
	<TopActionButton
		icon={sidepanelContext.isOpened ? WindowSolid : ColumnSolid}
		onclick={() => (sidepanelContext.isOpened = !sidepanelContext.isOpened)}
		ariaLabel={sidepanelContext.isOpened ? 'Switch to full width layout' : 'Switch to split layout'}
		title={sidepanelContext.isOpened ? 'Switch to full width layout' : 'Switch to split layout'}
		position="right"
	/>

	<div
		class={cn(
			'flex flex-col mx-auto h-full shrink-0', //
			!sidepanelContext.isOpened && 'w-full'
		)}
	>
		<!-- Scrollable messages area -->
		<ScrollableWrapper contentClass={'max-w-[1200px] pb-8'}>
			<InterlocutorDetails />

			{#each messagesContext.messages as message, index}
				{#if message.sender === 'AI'}
					{@const isLastMessage = index === messagesContext.messages.length - 1}
					<AiMessage
						message={message.content}
						isStillGenerating={isLastMessage && messagesContext.isGenerating}
						learningTips={message.learningTips}
					/>
				{/if}

				{#if message.sender === 'USER'}
					<UserMessage {message} />
				{/if}
			{/each}
		</ScrollableWrapper>

		<!-- Fixed textarea at bottom -->
		<UserMessageTextarea />
	</div>
</div>
