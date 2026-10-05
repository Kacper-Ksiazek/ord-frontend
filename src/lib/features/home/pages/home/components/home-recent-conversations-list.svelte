<script lang="ts">
	import { goto } from '$app/navigation';
	import { ConversationSummaryRow } from '$conversations/shared/components/conversation-summary-row';
	import type { ConversationSummaryDTO } from '$conversations/types';
	import { StatusPanel } from '$lib/components/utils/status-panel';
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		items: ConversationSummaryDTO[];
	}

	const { items }: Props = $props();
</script>

{#if items.length === 0}
	<div
		class="flex min-h-0 flex-1 flex-col justify-center"
		data-testid={E2E_TEST_IDS.home.recentConversationsEmpty}
	>
		<StatusPanel
			variant="information"
			class="!flex-none !py-10"
			header={m['features.home.home.recent_conversations_empty.header']()}
			description={m['features.home.home.recent_conversations_empty.description']()}
		/>
	</div>
{:else}
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
{/if}
