<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { AiMessage, SessionHud, UserMessage } from './components';
	import { getSidepanelContext } from '../../contexts/sidepanel-context.svelte';
	import { getMessagesContext } from '../../contexts/messages-context.svelte';
	import { UserMessageTextarea } from './components/user-message-textarea';
	import { getSidepanelWidth, getMessagesMaxWidth } from '../constants.svelte';
	import { ScrollableWrapper } from '$lib/components/utils/scrollable-wrapper';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/buttons/button';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';
	import * as m from '$lib/paraglide/messages.js';

	/** Poll scroll position while the assistant streams so layout growth is always followed. */
	const SCROLL_FOLLOW_INTERVAL_MS = 100;

	const sidepanelContext = getSidepanelContext();
	const messagesContext = getMessagesContext();

	const sidepanelWidth = $derived(getSidepanelWidth());
	const messagesMaxWidth = $derived(getMessagesMaxWidth());

	let scrollContainer: HTMLDivElement | undefined = $state(undefined);

	function scrollMessagesToBottom() {
		const el = scrollContainer;

		if (!el) {
			return;
		}

		el.scrollTo({
			top: el.scrollHeight,
			behavior: 'instant'
		});
	}

	const isFollowingGeneration = $derived(
		messagesContext.isGeneratingAiMessage || messagesContext.isGeneratingLearningTips
	);

	/** Pin to bottom while streaming/tips; immediate scroll + interval covers bind-after-start and growing content. */
	$effect(() => {
		if (!scrollContainer || !isFollowingGeneration) {
			return;
		}

		scrollMessagesToBottom();
		const id = window.setInterval(scrollMessagesToBottom, SCROLL_FOLLOW_INTERVAL_MS);

		return () => window.clearInterval(id);
	});

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
	data-testid={E2E_TEST_IDS.session.messagesPanel}
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
		<SessionHud />

		<!-- Scrollable messages area -->
		<ScrollableWrapper
			bind:scrollContainer
			contentClass="{messagesMaxWidth} mx-auto gap-14"
			wrapperClass="mb-4"
		>
			{#each messagesContext.messages as message, index (index)}
				{#if message.sender === 'AI'}
					<AiMessage
						message={message.content}
						messageIndex={index}
						isStillGenerating={messagesContext.isGeneratingAiMessage}
						learningTips={message.learningTips ?? null}
					/>
				{/if}

				{#if message.sender === 'USER'}
					<UserMessage messageIndex={index} {message} />
				{/if}
			{/each}
		</ScrollableWrapper>

		{#if messagesContext.aiStreamError}
			<div
				class="{messagesMaxWidth} mx-auto mb-3 flex flex-col items-start gap-2 rounded-[10px] border border-danger/30 bg-danger/10 p-3"
				role="alert"
			>
				<p class="text-sm text-danger">
					{messagesContext.aiStreamError === 'init'
						? m['features.conversation.session.stream_error.init']()
						: m['features.conversation.session.stream_error.message']()}
				</p>
				<Button
					type="OUTLINED"
					variant="PRIMARY"
					onClick={() => {
						messagesContext.aiStreamError = null;
					}}
				>
					{m['features.conversation.session.stream_error.dismiss']()}
				</Button>
			</div>
		{/if}

		<!-- Fixed textarea at bottom -->
		<UserMessageTextarea />
	</div>
</div>
