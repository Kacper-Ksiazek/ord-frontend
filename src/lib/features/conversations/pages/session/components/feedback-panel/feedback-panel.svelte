<script lang="ts">
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { Accordion, Badge, cn } from 'flowbite-svelte';
	import { getSidepanelContext } from '../../contexts/sidepanel-context.svelte';
	import { AccordionItem } from './components/accordion-item';
	import MistakeCard from './components/mistake-card.svelte';
	import StrengthCard from './components/strength-card.svelte';
	import VocabularyEnrichmentCard from './components/vocabulary-enrichment-card.svelte';
	import { SIDEPANEL_WIDTH } from '../constants';
	import { fade } from 'svelte/transition';

	const sidepanelContext = getSidepanelContext();

	const feedback = $derived(sidepanelContext.feedbackPreview);

	// Track open state for each accordion section
	let mistakesOpen = $state(false);
	let strengthsOpen = $state(false);
	let vocabularyEnrichmentOpen = $state(false);
</script>

<ContentCard
	class={cn(
		'flex flex-col transition-transform duration-300 origin-right h-full relative',
		'bg-white dark:bg-gray-800 transition-[width] overflow-hidden p-0!'
	)}
	style={sidepanelContext.isOpened ? `width: ${SIDEPANEL_WIDTH}px` : 'width: 0px'}
>
	{#if !sidepanelContext.isOpened}
		<div
			class="absolute top-0 left-0 w-full h-full cursor-pointer bg-white"
			transition:fade={{ duration: 100 }}
		></div>
	{/if}

	<div
		class={cn(
			'flex-1 overflow-y-auto min-h-0 p-8', // min-h-0 allows flex child to shrink below content size
			'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
		)}
	>
		{#if feedback}
			<div class="mb-6">
				<button
					class="text-sm text-gray-600 dark:text-gray-400 mb-4"
					onclick={() => (sidepanelContext.isOpened = false)}
				>
					Back
				</button>

				<h2 class="text-xl font-bold mb-4 dark:text-gray-100">Feedback Details</h2>

				<!-- Summary Section -->
				<div
					class="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
				>
					<div class="flex flex-wrap gap-2">
						{#if feedback.tutorComment}
							<Badge color="primary" large class="px-3 py-1.5 max-w-full">
								<span class="font-medium wrap-break-word">{feedback.tutorComment}</span>
							</Badge>
						{/if}
						{#if (feedback as any).discourse}
							<Badge color="primary" large class="px-3 py-1.5">
								<span class="font-medium">{(feedback as any).discourse}</span>
							</Badge>
						{/if}
					</div>
				</div>
			</div>

			<Accordion class="space-y-2">
				<!-- Mistakes Section -->
				{#if feedback.mistakes && feedback.mistakes.length > 0}
					<AccordionItem
						criteria="MISTAKES"
						title="Mistakes"
						badgeCount={feedback.mistakes.length}
						bind:open={mistakesOpen}
					>
						<div class="space-y-4 pt-2">
							{#each feedback.mistakes as mistake}
								<MistakeCard {mistake} />
							{/each}
						</div>
					</AccordionItem>
				{/if}

				<!-- Strengths Section -->
				{#if feedback.strengthsIdentified && feedback.strengthsIdentified.length > 0}
					<AccordionItem
						criteria="STRENGTHS"
						title="Strengths"
						badgeCount={feedback.strengthsIdentified.length}
						bind:open={strengthsOpen}
					>
						<div class="space-y-2 pt-2">
							{#each feedback.strengthsIdentified as strength}
								<StrengthCard {strength} />
							{/each}
						</div>
					</AccordionItem>
				{/if}

				<!-- Vocabulary Enrichment Section -->
				{#if feedback.vocabularyEnrichment && feedback.vocabularyEnrichment.length > 0}
					<AccordionItem
						criteria="VOCABULARY_ENRICHMENT"
						title="Vocabulary Enrichment"
						badgeCount={feedback.vocabularyEnrichment.length}
						bind:open={vocabularyEnrichmentOpen}
					>
						<div class="space-y-4 pt-2">
							{#each feedback.vocabularyEnrichment as enrichment}
								<VocabularyEnrichmentCard {enrichment} />
							{/each}
						</div>
					</AccordionItem>
				{/if}
			</Accordion>
		{:else}
			<div class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
				<p>No feedback available</p>
			</div>
		{/if}
	</div>
</ContentCard>
