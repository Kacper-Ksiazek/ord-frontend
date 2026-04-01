<script lang="ts">
	import IconCard from '$lib/components/cards/icon-card/icon-card.svelte';
	import type { ConversationListActivitySnapshot } from '$lib/types/conversation/api/conversation-list-activity';
	import { MessageSquare } from 'lucide-svelte';
	import ConversationActivityHeatmap from './conversation-activity-heatmap.svelte';

	interface Props {
		activity: ConversationListActivitySnapshot;
	}

	const { activity }: Props = $props();
</script>

<div class="flex w-full gap-4 mb-6">
	<ConversationActivityHeatmap days={activity.daily} />

	<IconCard title="Messages" value={activity.stats.messagesCount} variant="neutral" class="flex-1">
		{#snippet icon({ className })}
			<MessageSquare class={className} />
		{/snippet}
	</IconCard>

	<IconCard
		title="Conversations"
		value={activity.stats.conversationsCount}
		variant="neutral"
		class="flex-1"
	>
		{#snippet icon({ className })}
			<MessageSquare class={className} />
		{/snippet}
	</IconCard>
</div>
