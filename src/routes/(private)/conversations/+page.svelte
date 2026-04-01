<script lang="ts">
	import { page } from '$app/state';
	import { createConversationsQuery } from '$lib/api-client/conversation/queries';
	import { ConversationListFiltersState } from '$conversations/pages/list/state/conversation-list-state.svelte';
	import { StatusScreen } from '$lib/components/utils/status-screen';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { Breadcrumb } from '$lib/components/navigation/breadcrumb';
	import * as m from '$lib/paraglide/messages.js';
	import { Button } from '$lib/components/buttons/button';
	import { goto } from '$app/navigation';
	import {
		ConversationListFiltersBar,
		ConversationList,
		ConversationActivitySection
	} from '$lib/features/conversations/pages/list';
	import { buildMockConversationActivity } from '$lib/features/conversations/pages/list/mocks/conversation-activity.mock';

	const filtersState = new ConversationListFiltersState(page.url.searchParams);

	const conversationActivity = buildMockConversationActivity(new Date());

	const conversationsQuery = createConversationsQuery(() => filtersState.queryPayload);
</script>

<svelte:head>
	<title>Conversations</title>
</svelte:head>

{#if conversationsQuery.isError}
	<StatusScreen
		variant="error"
		header="Couldn't load conversations"
		description={conversationsQuery.error?.message || 'Something went wrong. Try again.'}
		primaryButton={{ label: 'Try again', onClick: () => conversationsQuery.refetch() }}
	/>
{:else}
	<PageContentContainer>
		<ContentCard class="p-6">
			<Breadcrumb
				class="mb-6"
				crumbs={[
					{ label: m['features.conversation.create.form.breadcrumb.home'](), href: '/' },
					{ label: m['features.conversation.create.form.breadcrumb.conversations']() }
				]}
			/>

			<div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Conversations</h1>
					<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
						Continue a practice chat or start a new one.
					</p>
				</div>

				<Button class="w-full shrink-0 sm:w-auto" onClick={() => goto('/conversations/create')}>
					New conversation
				</Button>
			</div>

			<ConversationActivitySection activity={conversationActivity} />

			<ConversationListFiltersBar {filtersState} />

			<ConversationList {conversationsQuery} {filtersState} />
		</ContentCard>
	</PageContentContainer>
{/if}
