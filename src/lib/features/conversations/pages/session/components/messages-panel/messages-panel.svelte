<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { AiMessage, ConversationHeader, TopActionButton, UserMessage } from './components';
	import { getSidepanelContext } from '../../contexts/sidepanel-context.svelte';
	import { getMessagesContext } from '../../contexts/messages-context.svelte';
	import { UserMessageTextarea } from './components/user-message-textarea';
	import { getSidepanelWidth, getMessagesMaxWidth } from '../constants.svelte';
	import { Columns2, ChevronLeft, PanelLeftClose } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import { onMount } from 'svelte';

	const sidepanelContext = getSidepanelContext();
	const messagesContext = getMessagesContext();

	const sidepanelWidth = $derived(getSidepanelWidth());
	const messagesMaxWidth = $derived(getMessagesMaxWidth());

	let scrollContainer: HTMLDivElement | undefined = $state(undefined);

	onMount(() => {
		if (scrollContainer) {
			scrollContainer.scrollTo({
				top: scrollContainer.scrollHeight,
				behavior: 'instant'
			});
		}
	});
</script>

<div
	class={cn(
		'bg-transparent transition-[width] transition-padding duration-300 origin-left relative pt-8',
		sidepanelContext.isOpened ? 'px-4' : 'px-12'
	)}
	style={sidepanelContext.isOpened ? `width: calc(100% - ${sidepanelWidth}px)` : 'width: 100%'}
>
	<div
		class={cn(
			'flex flex-col mx-auto h-full shrink-0 relative', //
			!sidepanelContext.isOpened && 'w-full'
		)}
	>
		<!-- Back Button -->
		<TopActionButton
			icon={ChevronLeft}
			onClick={() => goto('/conversations')}
			ariaLabel="Go back"
			title="Go back"
			position="left"
		>
			{#if !sidepanelContext.isOpened}
				<span>Go back</span>
			{/if}
		</TopActionButton>

		<!-- Layout Toggle Button -->
		<TopActionButton
			icon={sidepanelContext.isOpened ? PanelLeftClose : Columns2}
			onClick={() => (sidepanelContext.isOpened = !sidepanelContext.isOpened)}
			ariaLabel={sidepanelContext.isOpened ? 'Switch to full width layout' : 'Switch to split layout'}
			title={sidepanelContext.isOpened ? 'Switch to full width layout' : 'Switch to split layout'}
			position="right"
			disabled={messagesContext.messages.length < 2}
		>
			{#if !sidepanelContext.isOpened}
				<span> View summary </span>
			{/if}
		</TopActionButton>

		<!-- Scrollable messages area -->
		<ScrollableWrapper
			bind:scrollContainer
			contentClass="{messagesMaxWidth} mx-auto"
			wrapperClass="mb-4"
		>
			<ConversationHeader />

			{#each messagesContext.messages as message, index (index)}
				{#if message.sender === 'AI'}
					{@const isLastMessage = index === messagesContext.messages.length - 1}

					<AiMessage
						message={message.content}
						messageIndex={index}
						isStillGenerating={isLastMessage && messagesContext.isGenerating}
						learningTips={message.learningTips ?? null}
					/>
				{/if}

				{#if message.sender === 'USER'}
					<UserMessage messageIndex={index} {message} />
				{/if}
			{/each}
		</ScrollableWrapper>

		<!-- Fixed textarea at bottom -->
		<UserMessageTextarea />
	</div>
</div>
