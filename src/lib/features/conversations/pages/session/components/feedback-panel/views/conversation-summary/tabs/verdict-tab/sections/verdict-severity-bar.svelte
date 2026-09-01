<script lang="ts">
	import type { MistakeStats } from '../../overview-tab/sections/mistakes-severity/utils/compute-message-stats';

	interface VerdictSeverityBarProps {
		mistakeStats: MistakeStats;
		totalMistakes: number;
	}

	const { mistakeStats, totalMistakes }: VerdictSeverityBarProps = $props();

	const segments = $derived(
		(['MINOR', 'MODERATE', 'CRITICAL'] as const).map((severity) => ({
			severity,
			...mistakeStats[severity]
		}))
	);
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between gap-2">
		<h4 class="text-xs font-medium uppercase tracking-wide text-ink-muted">Błędy wg ważności</h4>
		<span class="text-xs text-ink-muted">{totalMistakes} łącznie</span>
	</div>

	{#if totalMistakes === 0}
		<p class="text-sm text-ink-muted">Brak błędów w tej sesji.</p>
	{:else}
		<div class="flex h-2.5 w-full gap-1" role="img" aria-label="Rozkład błędów wg ważności">
			{#each segments as segment (segment.severity)}
				{#if segment.count > 0}
					<div
						class="h-full min-w-[3px] rounded-full"
						style={`flex: ${segment.count} 1 0; background-color: ${segment.color}`}
						title={`${segment.label}: ${segment.count}`}
					></div>
				{/if}
			{/each}
		</div>

		<ul class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
			{#each segments as segment (segment.severity)}
				<li class="inline-flex items-center gap-1.5">
					<span
						class="size-2 rounded-full"
						style={`background-color: ${segment.color}`}
						aria-hidden="true"
					></span>
					<span>{segment.label}: {segment.count}</span>
				</li>
			{/each}
		</ul>
	{/if}
</div>
