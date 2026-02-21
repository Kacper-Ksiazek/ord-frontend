<script lang="ts">
	import { IconCard } from '$lib/components/cards/icon-card';
	import type { IconCardVariant } from '$lib/components/cards/icon-card';
	import type { FeedbackTabFilters } from '../../../feedback-tab.types';
	import type { AggregatedFeedbackItem } from '../../../utils/aggregate-feedback';
	import type { AggregatedSuggestion } from '../../../utils/aggregate-feedback/aggregate-feedback.types';
	import type { ConversationMessageSuggestionType } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { BookOpen, Layers } from 'lucide-svelte';

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

	function getCardConfig(type: ConversationMessageSuggestionType) {
		const config: Record<
			ConversationMessageSuggestionType,
			{
				title: string;
				variant: IconCardVariant;
				Icon: LucideIcon;
			}
		> = {
			VOCABULARY: {
				title: 'Vocabulary',
				variant: 'purple' as IconCardVariant,
				Icon: BookOpen
			},
			STRUCTURE: {
				title: 'Structure',
				variant: 'purple' as IconCardVariant,
				Icon: Layers
			}
		};

		return config[type];
	}
</script>

{#each suggestionTypeCards as card (card.type)}
	{@const config = getCardConfig(card.type)}
	{@const isDisabled = card.count === 0}

	<IconCard
		title={config.title}
		value={card.count ?? '-'}
		variant={config.variant}
		isActive={filters.suggestionType === card.type}
		disabled={isDisabled}
		onclick={() => selectSuggestionType(card.type)}
	>
		{#snippet icon({ className })}
			<config.Icon class={className} />
		{/snippet}
	</IconCard>
{/each}
