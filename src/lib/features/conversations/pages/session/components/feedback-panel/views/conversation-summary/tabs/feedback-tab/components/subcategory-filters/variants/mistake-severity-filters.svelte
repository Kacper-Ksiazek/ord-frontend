<script lang="ts">
	import type { FeedbackTabFilters } from '../../../feedback-tab.types';
	import { SubcategoryStatCard } from '../../subcategory-stat-card';
	import type { ConversationMessageMistakeSeverity } from '$lib/types/conversation/domain/conversation-message-feedback';
	import type { AggregatedFeedbackItem } from '../../../utils/aggregate-feedback';
	import type { AggregatedMistake } from '../../../utils/aggregate-feedback/aggregate-feedback.types';

	type MistakeSeverityCounts = Record<ConversationMessageMistakeSeverity, number>;

	interface Props {
		filters: FeedbackTabFilters;
		filteredItems: AggregatedFeedbackItem[];
	}

	interface MistakeSeverityCard {
		severity: ConversationMessageMistakeSeverity;
		count: number;
	}

	let { filters = $bindable(), filteredItems }: Props = $props();

	function selectMistakeSeverity(severity: ConversationMessageMistakeSeverity) {
		if (filters.severity === severity) {
			filters.severity = 'ALL';
			(document.activeElement as HTMLElement)?.blur();
		} else {
			filters.severity = severity;
		}
	}

	const mistakeSeverityCards = $derived.by(() => {
		const counts: MistakeSeverityCounts = (filteredItems as AggregatedMistake[]).reduce(
			(acc, item) => {
				acc[item.data.severity] = (acc[item.data.severity] ?? 0) + 1;

				return acc;
			},
			{} as MistakeSeverityCounts
		);

		const result: MistakeSeverityCard[] = [
			{
				severity: 'MINOR',
				count: counts.MINOR
			},
			{
				severity: 'MODERATE',
				count: counts.MODERATE
			},
			{
				severity: 'CRITICAL',
				count: counts.CRITICAL
			}
		];

		return result;
	});
</script>

{#each mistakeSeverityCards as card (card.severity)}
	<SubcategoryStatCard
		severity={card.severity}
		count={card.count}
		isCardActive={filters.severity === card.severity}
		onSelect={selectMistakeSeverity}
	/>
{/each}
