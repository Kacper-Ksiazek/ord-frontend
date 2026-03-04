<script lang="ts">
	import { IconCard } from '$lib/components/cards/icon-card';
	import type { IconCardVariant } from '$lib/components/cards/icon-card';
	import type { ConversationMessageMistakeSeverity } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { MISTAKE_SEVERITY_ICONS_MAP } from '$conversations/pages/session/constants/user-message-feedback/subcategory-icons';
	import type { SubcategoryFiltersProps } from './types';
	import { filterUserMessageReviews } from '$conversations/pages/session/components/feedback-panel/shared/filter-user-message-reviews/filter-user-message-reviews';

	type MistakeSeverityCounts = Record<ConversationMessageMistakeSeverity, number>;

	interface MistakeSeverityCard {
		severity: ConversationMessageMistakeSeverity;
		count: number;
		title: string;
		variant: IconCardVariant;
		Icon: LucideIcon;
	}

	let { filters = $bindable(), feedbacks }: SubcategoryFiltersProps = $props();

	function selectMistakeSeverity(severity: ConversationMessageMistakeSeverity) {
		if (filters.mistakeSeverity === severity) {
			filters.mistakeSeverity = 'ALL';
			(document.activeElement as HTMLElement)?.blur();
		} else {
			filters.mistakeSeverity = severity;
		}
	}

	const mistakeSeverityCards = $derived.by(() => {
		const counts: MistakeSeverityCounts = filterUserMessageReviews(feedbacks, {
			...filters,
			category: 'ALL'
		}).reduce((acc: MistakeSeverityCounts, item) => {
			if (item?.type !== 'MISTAKES') return acc;

			acc[item.data.severity] = (acc[item.data.severity] ?? 0) + 1;

			return acc;
		}, {} as MistakeSeverityCounts);

		const result: MistakeSeverityCard[] = [
			{
				severity: 'MINOR',
				count: counts.MINOR,
				title: 'Minor',
				variant: 'red',
				Icon: MISTAKE_SEVERITY_ICONS_MAP.MINOR
			},
			{
				severity: 'MODERATE',
				count: counts.MODERATE,
				title: 'Moderate',
				variant: 'red',
				Icon: MISTAKE_SEVERITY_ICONS_MAP.MODERATE
			},
			{
				severity: 'CRITICAL',
				count: counts.CRITICAL,
				title: 'Critical',
				variant: 'red',
				Icon: MISTAKE_SEVERITY_ICONS_MAP.CRITICAL
			}
		];

		return result;
	});
</script>

{#each mistakeSeverityCards as card (card.severity)}
	{@const isDisabled = card.count === 0}

	<IconCard
		title={card.title}
		value={card.count ?? '-'}
		variant={card.variant}
		isActive={filters.mistakeSeverity === card.severity}
		disabled={isDisabled}
		onclick={() => selectMistakeSeverity(card.severity)}
	>
		{#snippet icon({ className })}
			<card.Icon class={className} />
		{/snippet}
	</IconCard>
{/each}
