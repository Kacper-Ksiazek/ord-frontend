<script lang="ts">
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import { conversationSidepanelStore } from '$lib/features/conversations/pages/session/stores';
	import {
		FeedbackPanel,
		MessagesPanel
	} from '$lib/features/conversations/pages/session/components';
	import { onMount } from 'svelte';
	import { conversationMessagesStore } from '$lib/features/conversations/pages/session/stores';
	import isEmpty from 'lodash/isEmpty';
	import { initializeConversationByAI } from '$lib/api-client/ongoing-conversation/sse/initialize-conversation-by-ai';
	import { page } from '$app/state';

	onMount(() => {
		if (isEmpty(conversationMessagesStore.messages)) {
			conversationMessagesStore.initializeAiMessageGeneration();

			initializeConversationByAI(page.params.id).subscribe({
				next: (data) => {
					conversationMessagesStore.addGeneratedAiMessageLetter(data);
				},
				complete: () => {
					conversationMessagesStore.isGenerating = false;
				},
				error: () => {
					conversationMessagesStore.isGenerating = false;
				}
			});
		}
	});
</script>

<PageContentContainer layout="superwide">
	{#snippet header()}
		<!-- <ConversationDetails {conversation} /> -->
		<button onclick={() => conversationSidepanelStore.toggleSidepanel()}>
			{#if conversationSidepanelStore.isSidepanelOpened}
				Close Sidepanel
			{:else}
				Open Sidepanel
			{/if}
		</button>
	{/snippet}

	<MessagesPanel />

	<FeedbackPanel />
</PageContentContainer>
