<script lang="ts">
	import type { MistakeStats } from '../utils/compute-message-stats';
	import type { ConversationMessageMistakeSeverity } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { MISTAKE_SEVERITY_ICONS_MAP } from '$lib/features/conversations/pages/session/constants/user-message-feedback/subcategory-icons';
	import { MistakeSeverityIndicator } from '$lib/components/scores';

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

<div class="flex flex-col justify-center">
	<div class="space-y-3">
		{#each Object.entries(mistakeStats) as [severity, stats] (severity)}
			{@const Icon = MISTAKE_SEVERITY_ICONS_MAP[severity as ConversationMessageMistakeSeverity]}

			<div class="flex items-center gap-3">
				<div
					class="rounded-full shrink-0 flex items-center justify-center p-2.5"
					style="background-color: {stats.color}"
				>
					<Icon class="w-5 h-5 text-white" />
				</div>

				<div class="flex-1">
					<div class="label">{stats.label}</div>
					<div class="caption">
						{getMistakesCountLabel(stats.count)} • {stats.fraction}%
					</div>
				</div>

				<MistakeSeverityIndicator
					severity={severity as ConversationMessageMistakeSeverity}
					showLabel={false}
				/>
			</div>
		{/each}
	</div>
</div>
