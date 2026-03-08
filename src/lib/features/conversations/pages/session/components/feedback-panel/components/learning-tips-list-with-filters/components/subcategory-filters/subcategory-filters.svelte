<script lang="ts">
	import type { LearningTipFilters } from '../../lib/filters';
	import type { AggregatedLearningTip } from '../../../../shared/utils/aggregate-learning-tips/aggregate-learning-tips.types';
	import PhraseTypeFilters from './variants/phrase-type-filters.svelte';

	interface Props {
		filters: LearningTipFilters;
		tips: AggregatedLearningTip[];
	}

	let { filters = $bindable(), tips }: Props = $props();

	// Filter tips to only include phrase tips when category is PHRASES
	// This avoids redundant filtering in child components
	const phraseTips = $derived.by(() => {
		if (filters.category !== 'PHRASES') return [];

		return tips.filter((tip) => tip.type === 'PHRASES');
	});

	const hasPhraseTips = $derived(phraseTips.length > 0);
</script>

<div class="flex justify-between items-center gap-2 mb-4">
	{#if filters.category === 'PHRASES' && hasPhraseTips}
		<PhraseTypeFilters bind:filters tips={phraseTips} />
	{/if}
</div>
