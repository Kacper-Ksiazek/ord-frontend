<script lang="ts">
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { cn } from 'flowbite-svelte';
	import { getSidepanelContext } from '../../contexts/sidepanel-context.svelte';
	import { getSidepanelWidth } from '../constants.svelte';
	import { fade } from 'svelte/transition';
	import { Breadcrumbs } from '$lib/components/navigation/breadcrumbs';
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

	const breadcrumbItems = $derived.by(() => {
		if (!showBreadcrumb) return [];

		const label =
			sidepanelContext.learningTipsPreviewMessageOrder != null ? 'Learning Tips' : 'Feedback';

		return [
			{
				label: 'Summary',
				onClick: () => {
					sidepanelContext.feedbackPreview = null;
					sidepanelContext.learningTipsPreviewMessageOrder = null;
				}
			},
			{ label }
		];
	});
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
			<Breadcrumbs items={breadcrumbItems} class="mb-3" />
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
