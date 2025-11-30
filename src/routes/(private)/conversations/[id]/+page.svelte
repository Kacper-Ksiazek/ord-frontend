<script lang="ts">
	import { createConversationQuery } from '$lib/api-client/conversation/queries';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import { page } from '$app/state';
	import ConversationTypeIcon from '$lib/components/features/conversation/conversation-type-icon.svelte';
	import ConversationDetails from '$lib/components/features/conversation/session/conversation-details.svelte';
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import InterlocutorDetails from '$lib/components/features/conversation/session/interlocutor-details.svelte';

	const conversationQuery = createConversationQuery(page.params.id);

	const conversation = $derived(conversationQuery.data);
	const isLoading = $derived(conversationQuery.isLoading);
	const isError = $derived(conversationQuery.isError);
	const error = $derived(conversationQuery.error);

	const jsonString = $derived(conversation ? JSON.stringify(conversation, null, 2) : null);

	$inspect(conversation);
</script>

<svelte:head>
	<title>Conversation {page.params.id}</title>
</svelte:head>

<PageContentContainer layout="superwide">
	{#snippet header()}
		{#if !!conversation}
			<ConversationDetails {conversation} />
		{/if}
	{/snippet}

	<ContentCard class="basis-7/10">
		<h1>Conversation {page.params.id}</h1>
		<InterlocutorDetails {conversation} />
	</ContentCard>

	<ContentCard class="basis-3/10">
		<h2>Conversation Details</h2>
	</ContentCard>
</PageContentContainer>
