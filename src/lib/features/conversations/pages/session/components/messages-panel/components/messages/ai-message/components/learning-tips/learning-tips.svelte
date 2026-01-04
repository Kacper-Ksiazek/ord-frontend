<script lang="ts">
	import type { AIMessageLearningTips } from '$lib/types/ongoing-conversation/api/responses';
	import { cn } from 'flowbite-svelte';
	import size from 'lodash/size';
	import AiPostProcessActionBase from '../../../ai-post-process-action-base.svelte';

	interface LearningTipsProps {
		learningTips: AIMessageLearningTips;
	}

	const { learningTips }: LearningTipsProps = $props();

	const hasGrammarTips = $derived.by(() => size(learningTips.grammarTips) > 0);
	const hasVocabularyTips = $derived.by(() => size(learningTips.vocabularyTips) > 0);
	const hasIdiomTips = $derived.by(() => size(learningTips.idiomTips) > 0);

	const hasTips = $derived.by(() => hasGrammarTips || hasVocabularyTips || hasIdiomTips);

	const availableTabs = $derived.by(() => {
		const tabs: Array<{ id: string; label: string; count: number }> = [];
		if (hasGrammarTips) {
			tabs.push({
				id: 'grammar',
				label: 'Gramatyka',
				count: size(learningTips.grammarTips)
			});
		}
		if (hasVocabularyTips) {
			tabs.push({
				id: 'vocabulary',
				label: 'Słownictwo',
				count: size(learningTips.vocabularyTips)
			});
		}
		if (hasIdiomTips) {
			tabs.push({
				id: 'idioms',
				label: 'Idiomy',
				count: size(learningTips.idiomTips)
			});
		}
		return tabs;
	});

	let activeTab = $state('');

	$effect(() => {
		if (availableTabs.length > 0 && (!activeTab || !availableTabs.find((t) => t.id === activeTab))) {
			activeTab = availableTabs[0].id;
		}
	});
</script>

{#if hasTips}
	<AiPostProcessActionBase
		label="Wskazówki do nauki"
		onclick={() => {
			alert('clicked');
		}}
	>
		<div class="flex flex-col">
			<!-- Tab List -->
			<div class="border-b border-gray-200 dark:border-gray-700 flex gap-1">
				{#each availableTabs as tab}
					<button
						onclick={(e) => {
							e.stopPropagation();
							activeTab = tab.id;
						}}
						class={cn(
							'px-4 py-2 text-sm font-medium transition-colors border-b-2',
							activeTab === tab.id
								? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
						)}
					>
						{tab.label}
						{#if tab.count > 0}
							<span class="ml-1.5 text-xs">({tab.count})</span>
						{/if}
					</button>
				{/each}
			</div>

			<!-- Tab Panels -->
			<div class="pt-3">
				{#if activeTab === 'grammar' && hasGrammarTips}
					<div class="flex flex-col gap-2">
						{#each learningTips.grammarTips as tip}
							<div
								class="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700"
							>
								<p class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
									{tip.phrase}
								</p>
								{#if tip.grammarPoint}
									<p class="text-xs text-gray-600 dark:text-gray-400 mb-1">
										<strong>Punkt gramatyczny:</strong>
										{tip.grammarPoint}
									</p>
								{/if}
								{#if tip.explanation}
									<p class="text-xs text-gray-700 dark:text-gray-300">{tip.explanation}</p>
								{/if}
							</div>
						{/each}
					</div>
				{/if}

				{#if activeTab === 'vocabulary' && hasVocabularyTips}
					<div class="flex flex-col gap-2">
						{#each learningTips.vocabularyTips as tip}
							<div
								class="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700"
							>
								<p class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
									{tip.word}
								</p>
								{#if tip.definition}
									<p class="text-xs text-gray-700 dark:text-gray-300 mb-1">{tip.definition}</p>
								{/if}
								{#if tip.usageNote}
									<p class="text-xs text-gray-600 dark:text-gray-400 mb-1">
										<strong>Uwaga:</strong>
										{tip.usageNote}
									</p>
								{/if}
								{#if tip.proficiencyLevel}
									<p class="text-xs text-gray-500 dark:text-gray-500">
										Poziom: {tip.proficiencyLevel}
									</p>
								{/if}
							</div>
						{/each}
					</div>
				{/if}

				{#if activeTab === 'idioms' && hasIdiomTips}
					<div class="flex flex-col gap-2">
						{#each learningTips.idiomTips as tip}
							<div
								class="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700"
							>
								<p class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
									{tip.phrase}
								</p>
								{#if tip.meaning}
									<p class="text-xs text-gray-700 dark:text-gray-300 mb-1">
										<strong>Znaczenie:</strong>
										{tip.meaning}
									</p>
								{/if}
								{#if tip.example}
									<p class="text-xs text-gray-600 dark:text-gray-400 italic">
										Przykład: {tip.example}
									</p>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</AiPostProcessActionBase>
{/if}
