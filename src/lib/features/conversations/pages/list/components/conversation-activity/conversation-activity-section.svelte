<script lang="ts">
	import type { ConversationActivityOverview } from '$conversations/types';
	import ConversationActivityHeatmap from './conversation-activity-heatmap.svelte';
	import ConversationStatsCards from './conversation-stats-cards.svelte';

	interface Props {
		activity: ConversationActivityOverview;
	}

	const { activity }: Props = $props();
</script>

<div class="mb-6 flex w-full min-w-0 flex-col gap-3 xl:flex-row">
	<ConversationActivityHeatmap heatmap={activity.heatmap} />
	<ConversationStatsCards {activity} />
</div>
