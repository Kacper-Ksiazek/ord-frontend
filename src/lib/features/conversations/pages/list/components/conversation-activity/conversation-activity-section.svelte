<script lang="ts">
	import type { ConversationActivityOverview } from '$conversations/types';
	import ConversationActivityHeatmap from './conversation-activity-heatmap.svelte';
	import ConversationStatsCards from './conversation-stats-cards.svelte';

	interface Props {
		activity: ConversationActivityOverview;
	}

	const { activity }: Props = $props();
</script>

<div class="mb-6 flex w-full gap-3">
	<ConversationActivityHeatmap heatmap={activity.heatmap} />
	<ConversationStatsCards {activity} />
</div>
