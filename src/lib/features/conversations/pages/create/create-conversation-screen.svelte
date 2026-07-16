<script lang="ts">
	import { CreateConversationForm } from './components';
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
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
