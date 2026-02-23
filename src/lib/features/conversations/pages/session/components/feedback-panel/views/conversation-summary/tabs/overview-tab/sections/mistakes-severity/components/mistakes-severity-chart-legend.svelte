<script lang="ts">
	import type { MistakeStats } from '../utils/compute-message-stats';

	interface Props {
		mistakeStats: MistakeStats;
	}

	const { mistakeStats }: Props = $props();

	function getMistakesCountLabel(count: number): string {
		if (count === 0) return 'No mistakes';
		if (count === 1) return '1 mistake';

		return `${count} mistakes`;
	}
</script>

<div class="p-4 rounded-lg flex flex-col justify-center">
	<div class="space-y-3">
		{#each Object.entries(mistakeStats) as [severity, stats] (severity)}
			<div class="flex items-center gap-3">
				<div class="w-4 h-4 rounded-full shrink-0" style="background-color: {stats.color}"></div>

				<div class="flex-1">
					<div class="label">{stats.label}</div>
					<div class="caption">
						{getMistakesCountLabel(stats.count)} • {stats.fraction}%
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
