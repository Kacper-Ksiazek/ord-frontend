<script lang="ts">
	import { CreateConversationForm } from '$lib/features/conversations/pages/create';
	import { ContentCard } from '$lib/components/surfaces/content-card';
	import { PageContentContainer } from '$lib/components/surfaces/page-content-container';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';
</script>

<svelte:head>
	<title>New Conversation</title>
</svelte:head>

<PageContentContainer>
	<ContentCard data-testid={E2E_TEST_IDS.createConversation.page}>
		<CreateConversationForm />
	</ContentCard>
</PageContentContainer>
