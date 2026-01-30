<script lang="ts">
	import compact from 'lodash/compact';
	import isEmpty from 'lodash/isEmpty';
	import { Tabs } from '$lib/components/tabs';
	import type { Tab } from '$lib/components/tabs';
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
	import type {
		AIMessageGrammarTip,
		AIMessageVocabularyTip,
		AIMessagePhraseTip
	} from '$lib/types/ongoing-conversation/api/responses';
	import {
		GrammarTipCard,
		VocabularyTipCard,
		PhraseTipCard
	} from '../../../../shared/ai-message-learning-tips/cards';

	interface Props {
		allGrammarTips: AIMessageGrammarTip[];
		allVocabularyTips: AIMessageVocabularyTip[];
		allPhraseTips: AIMessagePhraseTip[];
		totalLearningTips: number;
	}

	let { allGrammarTips, allVocabularyTips, allPhraseTips, totalLearningTips }: Props = $props();

	let activeTab = $state<LearningTipCategory | 'all'>('all');

	const tabs = $derived.by(() => {
		return compact([
			{
				id: 'all',
				label: 'All',
				count: totalLearningTips,
				disabled: false
			},
			!isEmpty(allGrammarTips) && {
				id: 'GRAMMAR',
				label: 'Grammar',
				count: allGrammarTips.length,
				disabled: false
			},
			!isEmpty(allVocabularyTips) && {
				id: 'VOCABULARY',
				label: 'Vocabulary',
				count: allVocabularyTips.length,
				disabled: false
			},
			!isEmpty(allPhraseTips) && {
				id: 'PHRASES',
				label: 'Phrases',
				count: allPhraseTips.length,
				disabled: false
			}
		]) satisfies Tab[];
	});

	const filteredTips = $derived.by(() => {
		if (activeTab === 'all') {
			return {
				grammar: allGrammarTips,
				vocabulary: allVocabularyTips,
				phrases: allPhraseTips
			};
		}

		if (activeTab === 'GRAMMAR') {
			return { grammar: allGrammarTips, vocabulary: [], phrases: [] };
		}
		if (activeTab === 'VOCABULARY') {
			return { grammar: [], vocabulary: allVocabularyTips, phrases: [] };
		}
		if (activeTab === 'PHRASES') {
			return { grammar: [], vocabulary: [], phrases: allPhraseTips };
		}

		return { grammar: [], vocabulary: [], phrases: [] };
	});
</script>

{#if !isEmpty(allGrammarTips) || !isEmpty(allVocabularyTips) || !isEmpty(allPhraseTips)}
	<div class="shrink-0 mb-4">
		<Tabs {tabs} bind:activeTab activeColor="green" />
	</div>

	<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0">
		{#snippet children()}
			<div class="space-y-4">
				{#if !isEmpty(filteredTips.grammar)}
					{#each filteredTips.grammar as tip}
						<GrammarTipCard {tip} />
					{/each}
				{/if}

				{#if !isEmpty(filteredTips.vocabulary)}
					{#each filteredTips.vocabulary as tip}
						<VocabularyTipCard {tip} />
					{/each}
				{/if}

				{#if !isEmpty(filteredTips.phrases)}
					{#each filteredTips.phrases as tip}
						<PhraseTipCard {tip} />
					{/each}
				{/if}

				{#if isEmpty(filteredTips.grammar) && isEmpty(filteredTips.vocabulary) && isEmpty(filteredTips.phrases)}
					<p class="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
						No learning tips found for this category.
					</p>
				{/if}
			</div>
		{/snippet}
	</ScrollableWrapper>
{:else}
	<div class="text-center py-8 text-gray-500 dark:text-gray-400">
		<p>No learning tips available yet.</p>
	</div>
{/if}
