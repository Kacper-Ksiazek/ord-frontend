<script lang="ts">
	import type { AggregatedFeedbackItem } from '../../utils/aggregate-feedback';
	import type { UserMessageReviewFilters } from '../../lib/filters';
	import { MistakeSeverityFilters, SuggestionTypeFilters } from './variants';

	interface Props {
		filters: UserMessageReviewFilters;
		feedbacks: AggregatedFeedbackItem[];
	}

	let { filters = $bindable(), feedbacks }: Props = $props();
</script>

<div class="flex justify-between items-center gap-2 mb-4">
	{#if filters.category === 'MISTAKES'}
		<MistakeSeverityFilters bind:filters {feedbacks} />
	{/if}

	{#if filters.category === 'SUGGESTIONS'}
		<SuggestionTypeFilters bind:filters {feedbacks} />
	{/if}
</div>
