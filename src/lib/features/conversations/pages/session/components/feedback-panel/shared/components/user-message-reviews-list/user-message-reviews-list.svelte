<script lang="ts">
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import { MessageSquareOffIcon, TrashIcon } from 'lucide-svelte';
	import { filterUserMessageReviews } from '../../utils/filter-user-message-reviews/filter-user-message-reviews';
	import type { UserMessageReviewFilters } from '$conversations/pages/session/components/feedback-panel/components/user-message-reviews-list-with-filters/lib/filters';
	import type { AggregatedFeedbackItem } from '../../utils/aggregate-feedback/aggregate-feedback.types';
	import { Button } from '$lib/components/buttons/button';
	import isEmpty from 'lodash/isEmpty';
	import {
		MistakeCard,
		StrengthCard,
		SuggestionCard
	} from '$conversations/pages/session/components/shared/user-message-feedback/cards';

	interface UserMessageReviewsListProps {
		feedbacks: AggregatedFeedbackItem[];
		filters: UserMessageReviewFilters;
		clearFilters: () => void;
	}

	const { feedbacks, filters, clearFilters }: UserMessageReviewsListProps = $props();

	const feedbackToRender: AggregatedFeedbackItem[] = $derived(
		filterUserMessageReviews(feedbacks, filters)
	);
</script>

{#snippet userMessageReviewsListElement(item: AggregatedFeedbackItem)}
	{#if item.type === 'MISTAKES'}
		<MistakeCard mistake={item.data} />
	{:else if item.type === 'STRENGTHS'}
		<StrengthCard strength={item.data} />
	{:else if item.type === 'SUGGESTIONS'}
		<SuggestionCard suggestion={item.data} />
	{/if}
{/snippet}

{#snippet emptyState()}
	<div class="flex-1 flex flex-col items-center justify-center h-full text-muted">
		<MessageSquareOffIcon class="w-16 h-16 opacity-20" />
		<p class="text-muted-small text-center py-4">No feedback to show for current filters.</p>

		<Button variant="DELETE" type="OUTLINED" onClick={clearFilters} class="mt-4">
			<TrashIcon class="w-4 h-4" />
			<span> Clear filters</span>
		</Button>
	</div>
{/snippet}

{#key Object.values(filters).join('-')}
	<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0">
		{#if !isEmpty(feedbackToRender)}
			<div class="space-y-4">
				{#each feedbackToRender as item, i (i)}
					{@render userMessageReviewsListElement(item)}
				{/each}
			</div>
		{:else}
			{@render emptyState()}
		{/if}
	</ScrollableWrapper>
{/key}
