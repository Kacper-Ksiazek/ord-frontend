<script lang="ts">
	import { IconCard } from '$lib/components/cards/icon-card';
	import type { IconCardVariant } from '$lib/components/cards/icon-card';
	import type { FeedbackTabFilters } from '../../../feedback-tab.types';
	import type { AggregatedFeedbackItem } from '../../../utils/aggregate-feedback';
	import type { ConversationMessageSuggestionType } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { SUGGESTION_TYPE_ICONS_MAP } from '$conversations/pages/session/constants/user-message-feedback/subcategory-icons';
	import { filterFeedback } from '../../../utils';

	type SuggestionTypeCounts = Record<ConversationMessageSuggestionType, number>;

	type SuggestionTypeCardConfig = {
		type: ConversationMessageSuggestionType;
		count: number;
		title: string;
		variant: IconCardVariant;
		Icon: LucideIcon;
	};

	interface Props {
		filters: FeedbackTabFilters;
		feedbacks: AggregatedFeedbackItem[];
	}

	let { filters = $bindable(), feedbacks }: Props = $props();

	function selectSuggestionType(type: ConversationMessageSuggestionType) {
		if (filters.suggestionType === type) {
			filters.suggestionType = 'ALL';
			(document.activeElement as HTMLElement)?.blur();
		} else {
			filters.suggestionType = type;
		}
	}

	const suggestionTypeCards = $derived.by(() => {
		const counts: SuggestionTypeCounts = filterFeedback(feedbacks, {
			...filters,
			tab: 'ALL'
		}).reduce((acc, item) => {
			if (item?.type !== 'SUGGESTIONS') return acc;

			acc[item.data.suggestionType] = (acc[item.data.suggestionType] ?? 0) + 1;

			return acc;
		}, {} as SuggestionTypeCounts);

		return [
			{
				type: 'VOCABULARY',
				count: counts.VOCABULARY,
				title: 'Vocabulary',
				variant: 'blue',
				Icon: SUGGESTION_TYPE_ICONS_MAP.VOCABULARY
			},
			{
				type: 'STRUCTURE',
				count: counts.STRUCTURE,
				title: 'Structure',
				variant: 'blue',
				Icon: SUGGESTION_TYPE_ICONS_MAP.STRUCTURE
			}
		] satisfies SuggestionTypeCardConfig[];
	});
</script>

{#each suggestionTypeCards as card (card.type)}
	{@const isDisabled = card.count === 0}

	<IconCard
		title={card.title}
		value={card.count ?? '-'}
		variant={card.variant}
		isActive={filters.suggestionType === card.type}
		disabled={isDisabled}
		onclick={() => selectSuggestionType(card.type)}
	>
		{#snippet icon({ className })}
			<card.Icon class={className} />
		{/snippet}
	</IconCard>
{/each}
