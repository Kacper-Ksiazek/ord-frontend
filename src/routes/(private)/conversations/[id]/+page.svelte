<script lang="ts">
	import { createConversationQuery } from '$lib/api-client/conversation/queries';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import { page } from '$app/state';
	import {
		conversationStore,
		conversationSidepanelStore
	} from '$lib/features/conversations/pages/session/stores';
	import {
		FeedbackPanel,
		MessagesPanel
	} from '$lib/features/conversations/pages/session/components';

	const conversationQuery = createConversationQuery(page.params.id);

	$effect(() => {
		if (conversationQuery.data) {
			conversationStore.initialize(conversationQuery.data);
		}
	});
</script>

<svelte:head>
	<title>Conversation {page.params.id}</title>
</svelte:head>

{#if !conversationQuery.data}
	<!--  -->
{:else}
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
{/if}
