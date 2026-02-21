<script lang="ts">
	import { IconCard } from '$lib/components/cards/icon-card';
	import type { IconCardVariant } from '$lib/components/cards/icon-card';
	import type { FeedbackTabFilters } from '../../../feedback-tab.types';
	import type { ConversationMessageMistakeSeverity } from '$lib/types/conversation/domain/conversation-message-feedback';
	import type { AggregatedFeedbackItem } from '../../../utils/aggregate-feedback';
	import type { AggregatedMistake } from '../../../utils/aggregate-feedback/aggregate-feedback.types';
	import { CircleAlert, TriangleAlert, CircleX } from 'lucide-svelte';

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

	function getCardConfig(severity: ConversationMessageMistakeSeverity) {
		const config: Record<
			ConversationMessageMistakeSeverity,
			{
				title: string;
				variant: IconCardVariant;
				Icon: LucideIcon;
			}
		> = {
			MINOR: {
				title: 'Minor',
				variant: 'red' as IconCardVariant,
				Icon: CircleAlert
			},
			MODERATE: {
				title: 'Moderate',
				variant: 'red' as IconCardVariant,
				Icon: TriangleAlert
			},
			CRITICAL: {
				title: 'Critical',
				variant: 'red' as IconCardVariant,
				Icon: CircleX
			}
		};

		return config[severity];
	}
</script>

{#each mistakeSeverityCards as card (card.severity)}
	{@const config = getCardConfig(card.severity)}
	{@const isDisabled = card.count === 0}
	<IconCard
		title={config.title}
		value={card.count ?? '-'}
		variant={config.variant}
		isActive={filters.severity === card.severity}
		disabled={isDisabled}
		onclick={() => selectMistakeSeverity(card.severity)}
	>
		{#snippet icon({ className })}
			<config.Icon class={className} />
		{/snippet}
	</IconCard>
{/each}
