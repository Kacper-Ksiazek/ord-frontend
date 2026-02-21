<script lang="ts">
	import type { FeedbackTabFilters } from '../../../feedback-tab.types';
	import { SubcategoryStatCard } from '../../subcategory-stat-card';
	import type { AggregatedFeedbackItem } from '../../../utils/aggregate-feedback';
	import type { AggregatedSuggestion } from '../../../utils/aggregate-feedback/aggregate-feedback.types';
	import type { ConversationMessageSuggestionType } from '$lib/types/conversation/domain/conversation-message-feedback';

	type SuggestionTypeCounts = Record<ConversationMessageSuggestionType, number>;

	interface Props {
		filters: FeedbackTabFilters;
		filteredItems: AggregatedFeedbackItem[];
	}

	interface SuggestionTypeCard {
		type: ConversationMessageSuggestionType;
		count: number;
	}

	let { filters = $bindable(), filteredItems }: Props = $props();

	function selectSuggestionType(type: ConversationMessageSuggestionType) {
		filters.suggestionType = type;
	}

	const suggestionTypeCards = $derived.by(() => {
		const counts: SuggestionTypeCounts = (filteredItems as AggregatedSuggestion[]).reduce(
			(acc, item) => {
				acc[item.data.suggestionType] = (acc[item.data.suggestionType] ?? 0) + 1;

				return acc;
			},
			{} as SuggestionTypeCounts
		);

		const result: SuggestionTypeCard[] = [
			{
				type: 'VOCABULARY',
				count: counts.VOCABULARY
			},
			{
				type: 'STRUCTURE',
				count: counts.STRUCTURE
			}
		];

		return result;
	});
</script>

{#each suggestionTypeCards as card (card.type)}
	<SubcategoryStatCard
		type={card.type}
		count={card.count}
		isCardActive={filters.suggestionType === card.type}
		onSelect={selectSuggestionType}
	/>
{/each}
