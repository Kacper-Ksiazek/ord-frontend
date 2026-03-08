<script lang="ts">
	import { IconCard } from '$lib/components/cards/icon-card';
	import type { IconCardVariant } from '$lib/components/cards/icon-card';
	import type { LearningTipFilters } from '../../../lib/filters';
	import type { AggregatedLearningTip } from '../../../../../shared/utils/aggregate-learning-tips/aggregate-learning-tips.types';
	import type { PhraseType } from '$lib/types/ongoing-conversation/api/responses';
	import { PHRASE_TYPE_ICONS_MAP } from '$conversations/pages/session/constants/ai-message-learning-tips/subcategory-icons';
	import { filterLearningTips } from '../../../../../shared/utils/filter-learning-tips';

	type PhraseTypeCounts = Record<PhraseType, number>;

	type PhraseTypeCardConfig = {
		type: PhraseType;
		count: number;
		title: string;
		variant: IconCardVariant;
		Icon: LucideIcon;
	};

	interface Props {
		filters: LearningTipFilters;
		tips: AggregatedLearningTip[];
	}

	let { filters = $bindable(), tips }: Props = $props();

	function selectPhraseType(type: PhraseType) {
		if (filters.phraseType === type) {
			filters.phraseType = 'ALL';
			(document.activeElement as HTMLElement)?.blur();
		} else {
			filters.phraseType = type;
		}
	}

	const phraseTypeCards = $derived.by(() => {
		// tips is already filtered to only include PHRASES type, so we only need to filter by other criteria
		// (like search and register) but not by phraseType itself
		const counts: PhraseTypeCounts = filterLearningTips(tips, {
			...filters,
			phraseType: 'ALL'
		}).reduce((acc, item) => {
			// Type guard to ensure item is PHRASES type
			if (item.type !== 'PHRASES') return acc;

			acc[item.data.phraseType] = (acc[item.data.phraseType] ?? 0) + 1;

			return acc;
		}, {} as PhraseTypeCounts);

		return [
			{
				type: 'LITERAL',
				count: counts.LITERAL,
				title: 'Literal',
				variant: 'purple',
				Icon: PHRASE_TYPE_ICONS_MAP.LITERAL
			},
			{
				type: 'IDIOMATIC',
				count: counts.IDIOMATIC,
				title: 'Idiomatic',
				variant: 'purple',
				Icon: PHRASE_TYPE_ICONS_MAP.IDIOMATIC
			}
		] satisfies PhraseTypeCardConfig[];
	});
</script>

{#each phraseTypeCards as card (card.type)}
	{@const isDisabled = card.count === 0}

	<IconCard
		title={card.title}
		value={card.count ?? '-'}
		variant={card.variant}
		isActive={filters.phraseType === card.type}
		disabled={isDisabled}
		onclick={() => selectPhraseType(card.type)}
	>
		{#snippet icon({ className })}
			<card.Icon class={className} />
		{/snippet}
	</IconCard>
{/each}
