<script lang="ts">
	import { IconCard } from '$lib/components/cards/icon-card';
	import type { IconCardVariant } from '$lib/components/cards/icon-card';
	import type { ConversationMessageSuggestionType } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { SUGGESTION_TYPE_ICONS_MAP } from '$conversations/pages/session/constants/user-message-feedback/subcategory-icons';
	import type { SubcategoryFiltersProps } from './types';
	import { filterUserMessageReviews } from '$conversations/pages/session/components/feedback-panel/shared/filter-user-message-reviews/filter-user-message-reviews';

	type SuggestionTypeCounts = Record<ConversationMessageSuggestionType, number>;

	type SuggestionTypeCardConfig = {
		type: ConversationMessageSuggestionType;
		count: number;
		title: string;
		variant: IconCardVariant;
		Icon: LucideIcon;
	};

	let { filters = $bindable(), feedbacks }: SubcategoryFiltersProps = $props();

	function selectSuggestionType(type: ConversationMessageSuggestionType) {
		if (filters.suggestionType === type) {
			filters.suggestionType = 'ALL';
			(document.activeElement as HTMLElement)?.blur();
		} else {
			filters.suggestionType = type;
		}
	}

	const suggestionTypeCards = $derived.by(() => {
		const counts: SuggestionTypeCounts = filterUserMessageReviews(feedbacks, {
			...filters,
			category: 'ALL'
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
	{@const count = card.count ?? 0}
	{@const isDisabled = count === 0}

	<IconCard
		title={card.title}
		value={count}
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
