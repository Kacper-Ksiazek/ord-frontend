<script lang="ts">
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { cn } from 'flowbite-svelte';
	import { getSidepanelContext } from '../../contexts/sidepanel-context.svelte';
	import { getSidepanelWidth } from '../constants.svelte';
	import { fade } from 'svelte/transition';
	import { ChevronRight } from 'lucide-svelte';
	import {
		UserMessageFeedbackView,
		AiMessageLearningTipsView,
		ConversationSummaryView
	} from './views';

	const sidepanelContext = getSidepanelContext();
	const sidepanelWidth = getSidepanelWidth();

	const showBreadcrumb = $derived(
		sidepanelContext.learningTipsPreviewMessageOrder != null ||
			sidepanelContext.feedbackPreview != null
	);

	const breadcrumbLabel = $derived(
		sidepanelContext.learningTipsPreviewMessageOrder != null ? 'Learning Tips' : 'Feedback'
	);

	function goToSummary() {
		sidepanelContext.feedbackPreview = null;
		sidepanelContext.learningTipsPreviewMessageOrder = null;
	}
</script>

<ContentCard
	class={cn(
		'flex flex-col transition-transform duration-300 origin-right h-full relative rounded-none',
		'bg-white dark:bg-gray-800 transition-[width] overflow-hidden p-0!'
	)}
	style={sidepanelContext.isOpened ? `width: ${sidepanelWidth}px` : 'width: 0px'}
>
	{#if !sidepanelContext.isOpened}
		<div
			class="absolute top-0 left-0 w-full h-full cursor-pointer"
			transition:fade={{ duration: 100 }}
		></div>
	{/if}

	<div
		class={cn(
			'flex-1 overflow-y-auto min-h-0 px-6 py-8', // min-h-0 allows flex child to shrink below content size
			'text-gray-900 dark:text-gray-100'
		)}
	>
		{#if showBreadcrumb}
			<nav class="mb-3 flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
				<button
					type="button"
					class="link-muted cursor-pointer bg-transparent border-none p-0 font-inherit text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
					onclick={goToSummary}
				>
					Summary
				</button>
				<ChevronRight class="size-3.5 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
				<span class="font-medium text-gray-900 dark:text-gray-100">{breadcrumbLabel}</span>
			</nav>
		{/if}
		{#if sidepanelContext.learningTipsPreviewMessageOrder != null}
			<AiMessageLearningTipsView />
		{:else if sidepanelContext.feedbackPreview}
			<UserMessageFeedbackView feedback={sidepanelContext.feedbackPreview} />
		{:else}
			<ConversationSummaryView />
		{/if}
	</div>
</ContentCard>
