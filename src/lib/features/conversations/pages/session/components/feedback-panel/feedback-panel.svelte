<script lang="ts">
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { cn } from 'flowbite-svelte';
	import { getSidepanelContext } from '../../contexts/sidepanel-context.svelte';
	import { getSidepanelWidth } from '../constants.svelte';
	import { fade } from 'svelte/transition';
	import { Breadcrumb } from '$lib/components/navigation/breadcrumb';
	import {
		UserMessageAnalysisView,
		AiMessageLearningTipsView,
		ConversationSummaryView
	} from './views';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';

	const sidepanelContext = getSidepanelContext();
	const sidepanelWidth = $derived(getSidepanelWidth());

	const showBreadcrumb = $derived(
		sidepanelContext.learningTipsPreviewMessageOrder != null ||
			sidepanelContext.analysisPreview != null
	);

	const breadcrumbLabel = $derived(
		sidepanelContext.learningTipsPreviewMessageOrder != null ? 'Learning Tips' : 'Feedback'
	);
</script>

<ContentCard
	data-testid={E2E_TEST_IDS.session.feedbackPanel}
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
			<Breadcrumb
				class="mb-3"
				crumbs={[
					{
						label: 'Summary',
						onClick: () => {
							sidepanelContext.analysisPreview = null;
							sidepanelContext.learningTipsPreviewMessageOrder = null;
						}
					},
					{ label: breadcrumbLabel }
				]}
			/>
		{/if}
		{#if sidepanelContext.learningTipsPreviewMessageOrder != null}
			<AiMessageLearningTipsView />
		{:else if sidepanelContext.analysisPreview}
			<UserMessageAnalysisView feedback={sidepanelContext.analysisPreview} />
		{:else}
			<ConversationSummaryView />
		{/if}
	</div>
</ContentCard>
