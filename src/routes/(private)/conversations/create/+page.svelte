<script lang="ts">
	import { CreateConversationForm } from '$lib/features/conversations/pages/create';
	import { ContentCard } from '$lib/components/surfaces/content-card';
	import { PageContentContainer } from '$lib/components/surfaces/page-content-container';
</script>

<svelte:head>
	<title>New Conversation</title>
</svelte:head>

<PageContentContainer>
	<ContentCard>
		<CreateConversationForm />
	</ContentCard>
</PageContentContainer>
