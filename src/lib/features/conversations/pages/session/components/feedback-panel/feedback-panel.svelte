<script lang="ts">
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { Accordion, AccordionItem, Badge, cn } from 'flowbite-svelte';
	import { CheckCircleSolid } from 'flowbite-svelte-icons';
	import { getSidepanelContext } from '../../contexts/sidepanel-context.svelte';
	import AccordionSectionHeader from './components/accordion-section-header.svelte';
	import ScoreItem from './components/score-item.svelte';
	import MistakeCard from './components/mistake-card.svelte';
	import StrengthCard from './components/strength-card.svelte';
	import VocabularyEnrichmentCard from './components/vocabulary-enrichment-card.svelte';
	import AlternativeExpressionsCard from './components/alternative-expressions-card.svelte';
	import CulturalNoteCard from './components/cultural-note-card.svelte';
	import { SIDEPANEL_WIDTH } from '../constants';
	import { fade } from 'svelte/transition';

	const sidepanelContext = getSidepanelContext();

	const feedback = $derived(sidepanelContext.feedbackPreview);

	const scoresCount = $derived.by(() => {
		if (!feedback) return 0;
		let count = 5; // grammar, vocabulary, answerLength, naturalness, coherenceWithContext
		if (feedback.registerAppropriate !== undefined) count += 1;
		return count;
	});
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
			<div class="mb-4">
				<button
					class="text-sm text-gray-600 dark:text-gray-400"
					onclick={() => (sidepanelContext.isOpened = false)}
				>
					Back
				</button>

				<h2 class="text-xl font-bold mb-2 dark:text-gray-100">Feedback Details</h2>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					Review your message feedback and suggestions
				</p>
			</div>

			<Accordion class="space-y-2">
				<!-- Scores Section -->
				<AccordionItem open={true}>
					{#snippet header()}
						<AccordionSectionHeader title="Scores" badgeCount={scoresCount} criteria="SCORES" />
					{/snippet}

					<div class="space-y-3 pt-2">
						<ScoreItem label="Grammar" score={feedback.grammar} />
						<ScoreItem label="Vocabulary" score={feedback.vocabulary} />
						<ScoreItem label="Answer Length" score={feedback.answerLength} />
						<ScoreItem label="Naturalness" score={feedback.naturalness} />
						<ScoreItem label="Coherence with Context" score={feedback.coherenceWithContext} />
						{#if feedback.registerAppropriate !== undefined}
							<div
								class="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
							>
								<span class="font-medium text-gray-900 dark:text-gray-100">Register Appropriate</span>
								{#if feedback.registerAppropriate}
									<Badge color="green" large>
										<CheckCircleSolid class="w-4 h-4 mr-1" />
										Yes
									</Badge>
								{:else}
									<Badge color="red" large>No</Badge>
								{/if}
							</div>
						{/if}
					</div>
				</AccordionItem>

				<!-- Mistakes Section -->
				{#if feedback.mistakes && feedback.mistakes.length > 0}
					<AccordionItem>
						{#snippet header()}
							<AccordionSectionHeader
								title="Mistakes"
								badgeCount={feedback.mistakes.length}
								criteria="MISTAKES"
							/>
						{/snippet}
						<div class="space-y-4 pt-2">
							{#each feedback.mistakes as mistake}
								<MistakeCard {mistake} />
							{/each}
						</div>
					</AccordionItem>
				{/if}

				<!-- Strengths Section -->
				{#if feedback.strengthsIdentified && feedback.strengthsIdentified.length > 0}
					<AccordionItem>
						{#snippet header()}
							<AccordionSectionHeader
								title="Strengths"
								badgeCount={feedback.strengthsIdentified.length}
								criteria="STRENGTHS"
							/>
						{/snippet}
						<div class="space-y-2 pt-2">
							{#each feedback.strengthsIdentified as strength}
								<StrengthCard {strength} />
							{/each}
						</div>
					</AccordionItem>
				{/if}

				<!-- Vocabulary Enrichment Section -->
				{#if feedback.vocabularyEnrichment && feedback.vocabularyEnrichment.length > 0}
					<AccordionItem>
						{#snippet header()}
							<AccordionSectionHeader
								title="Vocabulary Enrichment"
								badgeCount={feedback.vocabularyEnrichment.length}
								criteria="VOCABULARY_ENRICHMENT"
							/>
						{/snippet}
						<div class="space-y-4 pt-2">
							{#each feedback.vocabularyEnrichment as enrichment}
								<VocabularyEnrichmentCard {enrichment} />
							{/each}
						</div>
					</AccordionItem>
				{/if}

				<!-- Alternative Expressions Section -->
				{#if feedback.alternativeExpressions && feedback.alternativeExpressions.length > 0}
					<AccordionItem>
						{#snippet header()}
							<AccordionSectionHeader
								title="Alternative Expressions"
								badgeCount={feedback.alternativeExpressions.length}
								criteria="ALTERNATIVE_EXPRESSIONS"
							/>
						{/snippet}
						<div class="space-y-4 pt-2">
							{#each feedback.alternativeExpressions as alt}
								<AlternativeExpressionsCard {alt} />
							{/each}
						</div>
					</AccordionItem>
				{/if}

				<!-- Cultural Note Section -->
				{#if feedback.culturalNote}
					<AccordionItem>
						{#snippet header()}
							<AccordionSectionHeader title="Cultural Note" badgeCount={1} criteria="CULTURAL_NOTE" />
						{/snippet}
						<div class="pt-2">
							<CulturalNoteCard note={feedback.culturalNote} />
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
