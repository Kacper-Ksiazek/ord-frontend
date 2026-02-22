<script lang="ts">
	import type { LearningTipsTabFilters } from '../../learning-tips-tab.types';
	import type { AggregatedLearningTip } from '../../utils/aggregate-learning-tips/aggregate-learning-tips.types';
	import PhraseTypeFilters from './variants/phrase-type-filters.svelte';

	interface Props {
		filters: LearningTipsTabFilters;
		tips: AggregatedLearningTip[];
	}

	let { filters = $bindable(), tips }: Props = $props();
</script>

<div class="flex justify-between items-center gap-2 mb-4">
	{#if filters.tab === 'PHRASES'}
		<PhraseTypeFilters bind:filters {tips} />
	{/if}
</div>
