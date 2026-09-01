<script lang="ts">
	import type { CompactConversationMessage } from '$conversations/types';
	import type { ConversationMessagePerformanceScore } from '$conversations/types';
	import { getScoreChipClasses } from '$lib/components/scores/constants/score-colors';
	import { cn } from '$lib/utils/cn';
	import { computePerformanceAverages, getMetricLabel } from '../utils/verdict-utils';

	interface VerdictScoreStripProps {
		messages: CompactConversationMessage[];
	}

	type ScoreCard = {
		id: string;
		label: string;
		score: number;
	};

	const { messages }: VerdictScoreStripProps = $props();

	const averages = $derived(computePerformanceAverages(messages));

	const scoreCards = $derived.by<ScoreCard[]>(() => {
		if (!averages) {
			return [];
		}

		const overall = (averages.grammar + averages.vocabulary + averages.naturalness) / 3;

		const metrics: ConversationMessagePerformanceScore[] = ['grammar', 'vocabulary', 'naturalness'];

		return [
			{ id: 'overall', label: 'Średnia sesji', score: overall },
			...metrics.map((metric) => ({
				id: metric,
				label: getMetricLabel(metric),
				score: averages[metric]
			}))
		];
	});
</script>

{#if scoreCards.length > 0}
	<div class="grid grid-cols-4 gap-2">
		{#each scoreCards as card (card.id)}
			{@const chip = getScoreChipClasses(card.score)}
			<div
				class="flex min-w-0 flex-col items-center gap-2 rounded-[10px] border border-line bg-surface px-2 py-3"
			>
				<span
					class={cn(
						'flex h-8 min-w-8 items-center justify-center rounded px-2 text-base font-semibold tabular-nums leading-none',
						chip.bg,
						chip.text
					)}
				>
					{card.score.toFixed(1)}
				</span>
				<span class="text-center text-xs leading-tight text-ink-muted">{card.label}</span>
			</div>
		{/each}
	</div>
{/if}
