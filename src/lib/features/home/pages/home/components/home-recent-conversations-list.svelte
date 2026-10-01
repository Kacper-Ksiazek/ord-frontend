<script lang="ts">
	import { goto } from '$app/navigation';
	import { ConversationSummaryRow } from '$conversations/shared/components/conversation-summary-row';
	import type { ConversationSummaryDTO } from '$conversations/types';
	import { E2E_TEST_IDS } from '$home/testing/test-ids';

	interface Props {
		items: ConversationSummaryDTO[];
	}

	const { items }: Props = $props();
</script>

<ul class="flex flex-col gap-2">
	{#each items as conversation (conversation.id)}
		<li class="list-none">
			<ConversationSummaryRow
				{conversation}
				dataTestId={E2E_TEST_IDS.home.recentConversationRow(conversation.id ?? '')}
				onclick={() => goto(`/conversations/${conversation.id}`)}
			/>
		</li>
	{/each}
</ul>
