<script lang="ts">
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { Accordion, Badge, cn } from 'flowbite-svelte';
	import { Tabs } from '$lib/components/tabs';
	import type { Tab } from '$lib/components/tabs';
	import { getSidepanelContext } from '../../contexts/sidepanel-context.svelte';
	import { AccordionItem } from './components/accordion-item';
	import type {
		ConversationMessageMistakeSeverity,
		ConversationMessageSuggestionType
	} from '$lib/types/conversation/domain/conversation-message-feedback';
	import { SIDEPANEL_WIDTH } from '../constants';
	import { fade } from 'svelte/transition';
	import { MistakeCard, StrengthCard, SuggestionCard } from '../shared/user-message-feedback/cards';

	const sidepanelContext = getSidepanelContext();

	const feedback = $derived(sidepanelContext.feedbackPreview);

	let mistakesOpen = $state(false);
	let strengthsOpen = $state(false);
	let suggestionsOpen = $state(false);

	let activeSeverityTab = $state<ConversationMessageMistakeSeverity | 'all'>('all');

	const filteredMistakes = $derived.by(() => {
		if (!feedback?.mistakes) {
			return [];
		}

		if (activeSeverityTab === 'all') {
			return feedback.mistakes;
		}

		return feedback.mistakes.filter((mistake) => mistake.severity === activeSeverityTab);
	});

	let activeSuggestionTypeTab = $state<ConversationMessageSuggestionType | 'all'>('all');

	const filteredSuggestions = $derived.by(() => {
		if (!feedback?.suggestions) return [];
		if (activeSuggestionTypeTab === 'all') return feedback.suggestions;

		return feedback.suggestions.filter(
			(suggestion) => suggestion.suggestionType === activeSuggestionTypeTab
		);
	});

	const severityTabs = $derived.by(() => {
		if (!feedback?.mistakes) return [];
		const tabs: Tab[] = [
			{ id: 'all', label: 'All', count: feedback.mistakes.length, disabled: false }
		];

		const severities: ConversationMessageMistakeSeverity[] = ['MINOR', 'MODERATE', 'CRITICAL'];
		for (const severity of severities) {
			const count = feedback.mistakes.filter((m) => m.severity === severity).length;
			tabs.push({
				id: severity,
				label: severity,
				count,
				disabled: count === 0
			});
		}

		return tabs;
	});

	const suggestionTypeTabs = $derived.by(() => {
		if (!feedback?.suggestions) return [];
		const tabs: Tab[] = [
			{ id: 'all', label: 'All', count: feedback.suggestions.length, disabled: false }
		];

		const suggestionTypes: ConversationMessageSuggestionType[] = ['IMPROVEMENT', 'ENRICHMENT'];
		for (const type of suggestionTypes) {
			const count = feedback.suggestions.filter((s) => s.suggestionType === type).length;
			tabs.push({
				id: type,
				label: type,
				count,
				disabled: count === 0
			});
		}

		return tabs;
	});
</script>

<ContentCard
	class={cn(
		'flex flex-col transition-transform duration-300 origin-right h-full relative rounded-none',
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
					</div>
				</div>
			</div>

			<Accordion>
				<!-- Mistakes Section -->
				{#if feedback.mistakes && feedback.mistakes.length > 0}
					<AccordionItem
						criteria="MISTAKES"
						title="Mistakes"
						badgeCount={feedback.mistakes.length}
						bind:open={mistakesOpen}
					>
						<div>
							<!-- Severity Tabs -->
							<Tabs
								tabs={severityTabs}
								bind:activeTab={activeSeverityTab}
								activeColor="red"
								class="mb-4"
							/>

							<!-- Filtered Mistakes -->
							<div class="space-y-4">
								{#if filteredMistakes.length > 0}
									{#each filteredMistakes as mistake}
										<MistakeCard {mistake} />
									{/each}
								{:else}
									<p class="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
										No mistakes found for this severity level.
									</p>
								{/if}
							</div>
						</div>
					</AccordionItem>
				{/if}

				<!-- Strengths Section -->
				{#if feedback.strengths && feedback.strengths.length > 0}
					<AccordionItem
						criteria="STRENGTHS"
						title="Strengths"
						badgeCount={feedback.strengths.length}
						bind:open={strengthsOpen}
					>
						<div class="space-y-2 pt-2">
							{#each feedback.strengths as strength}
								<StrengthCard {strength} />
							{/each}
						</div>
					</AccordionItem>
				{/if}

				<!-- Suggestions Section -->
				{#if feedback.suggestions && feedback.suggestions.length > 0}
					<AccordionItem
						criteria="SUGGESTIONS"
						title="Suggestions"
						badgeCount={feedback.suggestions.length}
						bind:open={suggestionsOpen}
					>
						<div>
							<!-- Suggestion Type Tabs -->
							<Tabs
								tabs={suggestionTypeTabs}
								bind:activeTab={activeSuggestionTypeTab}
								activeColor="purple"
								class="mb-4"
							/>

							<!-- Filtered Suggestions -->
							<div class="space-y-4">
								{#if filteredSuggestions.length > 0}
									{#each filteredSuggestions as suggestion}
										<SuggestionCard {suggestion} />
									{/each}
								{:else}
									<p class="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
										No suggestions found for this type.
									</p>
								{/if}
							</div>
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
