<script lang="ts">
	import { IconCard } from '$lib/components/cards/icon-card';
	import type { IconCardVariant } from '$lib/components/cards/icon-card';
	import type { FeedbackTabFilters } from '../../../feedback-tab.types';
	import type { ConversationMessageMistakeSeverity } from '$lib/types/conversation/domain/conversation-message-feedback';
	import type { AggregatedFeedbackItem } from '../../../utils/aggregate-feedback';
	import { MISTAKE_SEVERITY_ICONS_MAP } from '$conversations/pages/session/constants/user-message-feedback/subcategory-icons';
	import { filterFeedback } from '../../../utils/filter-feedback';

	type MistakeSeverityCounts = Record<ConversationMessageMistakeSeverity, number>;

	interface MistakeSeverityCard {
		severity: ConversationMessageMistakeSeverity;
		count: number;
		title: string;
		variant: IconCardVariant;
		Icon: LucideIcon;
	}

	interface Props {
		filters: FeedbackTabFilters;
		feedbacks: AggregatedFeedbackItem[];
	}

	let { filters = $bindable(), feedbacks }: Props = $props();

	function selectMistakeSeverity(severity: ConversationMessageMistakeSeverity) {
		if (filters.severity === severity) {
			filters.severity = 'ALL';
			(document.activeElement as HTMLElement)?.blur();
		} else {
			filters.severity = severity;
		}
	}

	const mistakeSeverityCards = $derived.by(() => {
		const counts: MistakeSeverityCounts = filterFeedback(feedbacks, {
			...filters,
			tab: 'ALL'
		}).reduce((acc, item) => {
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
		isActive={filters.severity === card.severity}
		disabled={isDisabled}
		onclick={() => selectMistakeSeverity(card.severity)}
	>
		{#snippet icon({ className })}
			<card.Icon class={className} />
		{/snippet}
	</IconCard>
{/each}
