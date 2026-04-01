<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { ConversationListActivityStats } from '$lib/types/conversation/api/conversation-list-activity';
	import IconCard from '$lib/components/cards/icon-card/icon-card.svelte';
	import { MessageSquare } from 'lucide-svelte';

	interface Props {
		stats: ConversationListActivityStats;
		class?: string;
	}

	const { stats, class: className }: Props = $props();
</script>

<div class={cn('flex gap-4 min-w-[400px] flex-1', className)}>
	<IconCard title="Messages" value={stats.messagesCount} variant="neutral" class="flex-1">
		{#snippet icon({ className })}
			<MessageSquare class={className} />
		{/snippet}
	</IconCard>

	<IconCard title="Conversations" value={stats.conversationsCount} variant="neutral" class="flex-1">
		{#snippet icon({ className })}
			<MessageSquare class={className} />
		{/snippet}
	</IconCard>
</div>
