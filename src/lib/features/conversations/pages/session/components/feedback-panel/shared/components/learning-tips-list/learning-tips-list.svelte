<script lang="ts">
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import { MessageSquareOffIcon, TrashIcon } from 'lucide-svelte';
	import { filterLearningTips, type LearningTipFilters } from '../../utils/filter-learning-tips';
	import type { AggregatedLearningTip } from '../../utils/aggregate-learning-tips/aggregate-learning-tips.types';
	import { Button } from '$lib/components/buttons/button';
	import isEmpty from 'lodash/isEmpty';
	import {
		GrammarTipCard,
		PhraseTipCard,
		VocabularyTipCard
	} from '$conversations/pages/session/components/shared/ai-message-learning-tips/cards';

	interface LearningTipsListProps {
		tips: AggregatedLearningTip[];
		filters: LearningTipFilters;
		clearFilters: () => void;
	}

	const { tips, filters, clearFilters }: LearningTipsListProps = $props();

	const tipsToRender: AggregatedLearningTip[] = $derived(filterLearningTips(tips, filters));
</script>

{#snippet learningTipsListElement(item: AggregatedLearningTip)}
	{#if item.type === 'GRAMMAR'}
		<GrammarTipCard tip={item.data} />
	{:else if item.type === 'VOCABULARY'}
		<VocabularyTipCard tip={item.data} />
	{:else if item.type === 'PHRASES'}
		<PhraseTipCard tip={item.data} />
	{/if}
{/snippet}

{#snippet emptyState()}
	<div class="flex-1 flex flex-col items-center justify-center h-full text-muted">
		<MessageSquareOffIcon class="w-16 h-16 opacity-20" />
		<p class="text-muted-small text-center py-4">No learning tips to show for current filters.</p>

		<Button variant="DELETE" type="OUTLINED" onClick={clearFilters} class="mt-4">
			<TrashIcon class="w-4 h-4" />
			<span> Clear filters</span>
		</Button>
	</div>
{/snippet}

{#key Object.values(filters).join('-')}
	<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0">
		{#if !isEmpty(tipsToRender)}
			<div class="space-y-4">
				{#each tipsToRender as tip, i (i)}
					{@render learningTipsListElement(tip)}
				{/each}
			</div>
		{:else}
			{@render emptyState()}
		{/if}
	</ScrollableWrapper>
{/key}
