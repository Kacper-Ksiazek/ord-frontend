<script lang="ts">
	import type { AggregatedFeedbackItem } from '../../../../shared/utils/aggregate-feedback';
	import type { UserMessageReviewFilters } from '../../lib/filters';
	import { MistakeSeverityFilters, SuggestionTypeFilters } from './variants';

	interface Props {
		filters: UserMessageReviewFilters;
		feedbacks: AggregatedFeedbackItem[];
	}

	let { filters = $bindable(), feedbacks }: Props = $props();

	// Filter feedbacks to only include items matching the current category
	// This avoids redundant filtering in child components
	const filteredFeedbacks = $derived.by(() => {
		if (filters.category === 'ALL') return [];

		return feedbacks.filter((item) => item.type === filters.category);
	});
</script>

<div class="flex justify-between items-center gap-2 mb-4">
	{#if filters.category === 'MISTAKES'}
		<MistakeSeverityFilters bind:filters feedbacks={filteredFeedbacks} />
	{/if}

	{#if filters.category === 'SUGGESTIONS'}
		<SuggestionTypeFilters bind:filters feedbacks={filteredFeedbacks} />
	{/if}
</div>
