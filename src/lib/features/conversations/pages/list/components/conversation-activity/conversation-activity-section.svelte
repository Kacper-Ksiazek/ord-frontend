<script lang="ts">
	import type { ConversationActivityOverview } from '$conversations/types/api/conversation-list-activity';
	import ConversationActivityHeatmap from './conversation-activity-heatmap.svelte';
	import ConversationStatsCards from './conversation-stats-cards.svelte';

	interface Props {
		activity: ConversationActivityOverview;
	}

	const { activity }: Props = $props();
</script>

<div class="flex w-full gap-4 mb-6">
	<ConversationActivityHeatmap heatmap={activity.heatmap} />
	<ConversationStatsCards {activity} />
</div>
