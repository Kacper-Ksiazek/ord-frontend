<script lang="ts">
	import type { FeedbackTabFilters } from '../../feedback-tab.types';
	import type { AggregatedFeedbackItem } from '../../utils/aggregate-feedback/aggregate-feedback.types';
	import MistakeSeverityFilters from './variants/mistake-severity-filters.svelte';
	import SuggestionTypeFilters from './variants/suggestion-type-filters.svelte';

	interface Props {
		filters: FeedbackTabFilters;
		feedbacks: AggregatedFeedbackItem[];
	}

	let { filters = $bindable(), feedbacks }: Props = $props();
</script>

<div class="flex justify-between items-center gap-2 mb-4">
	{#if filters.tab === 'MISTAKES'}
		<MistakeSeverityFilters bind:filters {feedbacks} />
	{/if}

	{#if filters.tab === 'SUGGESTIONS'}
		<SuggestionTypeFilters bind:filters {feedbacks} />
	{/if}
</div>
