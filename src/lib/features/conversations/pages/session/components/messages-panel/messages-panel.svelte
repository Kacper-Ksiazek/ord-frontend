<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { AiMessage, ConversationHeader, TopActionButton, UserMessage } from './components';
	import { getSidepanelContext } from '../../contexts/sidepanel-context.svelte';
	import { getMessagesContext } from '../../contexts/messages-context.svelte';
	import { UserMessageTextarea } from './components/user-message-textarea';
	import { getSidepanelWidth, getMessagesMaxWidth } from '../constants.svelte';
	import { Columns2, ChevronLeft, PanelLeftClose } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { ScrollableWrapper } from '$lib/components/utils/scrollable-wrapper';
	import { onMount } from 'svelte';
	import { getConversationContext } from '../../contexts/conversation-context.svelte';
	import ConversationTypeIcon from '$conversations/shared/components/conversation-type-icon.svelte';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';
	import { Button } from '$lib/components/buttons/button';
	import * as m from '$lib/paraglide/messages.js';

	/** Hide the sticky topic strip while the main header topic is in view (top of scroll area). */
	const TOPIC_BAR_SHOW_AFTER_SCROLL_PX = 260;

	/** Poll scroll position while the assistant streams so layout growth is always followed. */
	const SCROLL_FOLLOW_INTERVAL_MS = 100;

	const sidepanelContext = getSidepanelContext();
	const messagesContext = getMessagesContext();
	const conversation = getConversationContext();

	const sidepanelWidth = $derived(getSidepanelWidth());
	const messagesMaxWidth = $derived(getMessagesMaxWidth());

	let scrollContainer: HTMLDivElement | undefined = $state(undefined);
	let messagesScrollTop = $state(0);

	$effect(() => {
		const el = scrollContainer;
		if (!el) return;

		const syncScrollTop = () => {
			messagesScrollTop = el.scrollTop;
		};

		syncScrollTop();
		el.addEventListener('scroll', syncScrollTop, { passive: true });

		return () => el.removeEventListener('scroll', syncScrollTop);
	});

	const showStickyTopicBar = $derived(messagesScrollTop >= TOPIC_BAR_SHOW_AFTER_SCROLL_PX);

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

			messagesScrollTop = scrollContainer.scrollTop;
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
		<!-- Back Button -->
		<TopActionButton
			dataTestId={E2E_TEST_IDS.session.backButton}
			icon={ChevronLeft}
			onClick={() => goto('/conversations')}
			ariaLabel="Go back"
			title="Go back"
			position="left"
			showAdditionalContent={showStickyTopicBar}
		>
			<span>Go back</span>

			{#snippet additionalContent()}
				<ConversationTypeIcon conversationType={conversation.type} class="size-5 shrink-0" />

				<span class="min-w-0 truncate leading-none">{conversation.topic}</span>
			{/snippet}
		</TopActionButton>

		<!-- Layout Toggle Button -->
		<TopActionButton
			dataTestId={E2E_TEST_IDS.session.summaryToggle}
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
			contentClass="{messagesMaxWidth} mx-auto gap-12"
			wrapperClass="mb-4"
		>
			<ConversationHeader />

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
				class="{messagesMaxWidth} mx-auto mb-3 flex flex-col items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20"
				role="alert"
			>
				<p class="text-sm text-red-800 dark:text-red-200">
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
