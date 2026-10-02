<script lang="ts">
	import { ConversationSummaryRow } from '$conversations/shared/components/conversation-summary-row';
	import type { ConversationSummaryDTO } from '$conversations/types';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';
	import ConversationListRowActions from './conversation-list-row-actions.svelte';

	interface Props {
		conversation: ConversationSummaryDTO;
		onclick: () => void;
	}

	const { conversation, onclick }: Props = $props();
</script>

<li class="list-none">
	<ConversationSummaryRow
		{conversation}
		{onclick}
		showChevron={false}
		dataTestId={E2E_TEST_IDS.conversations.row(conversation.id ?? '')}
	>
		{#snippet trailing()}
			<ConversationListRowActions conversationId={conversation.id ?? ''} />
		{/snippet}
	</ConversationSummaryRow>
</li>
