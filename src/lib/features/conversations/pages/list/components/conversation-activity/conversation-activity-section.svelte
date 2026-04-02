<script lang="ts">
	import type { ConversationListActivitySnapshot } from '$lib/types/conversation/api/conversation-list-activity';
	import ConversationActivityHeatmap from './conversation-activity-heatmap.svelte';
	import ConversationStatsCards from './conversation-stats-cards.svelte';

	interface Props {
		activity: ConversationListActivitySnapshot;
	}

	const { activity }: Props = $props();
</script>

<div class="flex w-full gap-4 mb-6">
	<ConversationActivityHeatmap days={activity.daily} />
	<ConversationStatsCards {activity} />
</div>
