<script lang="ts">
	import { page } from '$app/state';
	import {
		createConversationActivityOverviewQuery,
		createConversationsQuery
	} from '$lib/api-client/conversation/queries';
	import { ConversationListFiltersState } from '$conversations/pages/list/state/conversation-list-state.svelte';
	import { StatusScreen } from '$lib/components/feedback/status-screen';
	import { PageContentContainer } from '$lib/components/surfaces/page-content-container';
	import { ContentCard } from '$lib/components/surfaces/content-card';
	import { Breadcrumb } from '$lib/components/navigation/breadcrumb';
	import * as m from '$lib/paraglide/messages.js';
	import { Button } from '$lib/components/actions/button';
	import { goto } from '$app/navigation';
	import {
		ConversationListFiltersBar,
		ConversationList,
		ConversationActivitySection
	} from '$lib/features/conversations/pages/list';
	import { Loader } from '$lib/components/feedback/loader';

	const filtersState = new ConversationListFiltersState(page.url.searchParams);

	const activityOverviewQuery = createConversationActivityOverviewQuery();
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
		<ContentCard>
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

			{#if activityOverviewQuery.isPending}
				<div
					class="mb-6 flex min-h-[120px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50"
					aria-busy="true"
					aria-label="Loading activity overview"
				>
					<Loader wrapperClass="py-8" />
				</div>
			{:else if activityOverviewQuery.isError}
				<div
					class="mb-6 flex flex-col items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
					role="alert"
				>
					<p class="text-sm text-red-800 dark:text-red-200">
						{activityOverviewQuery.error?.message ?? "Couldn't load activity overview."}
					</p>
					<Button type="OUTLINED" variant="PRIMARY" onClick={() => activityOverviewQuery.refetch()}>
						Try again
					</Button>
				</div>
			{:else if activityOverviewQuery.data}
				<ConversationActivitySection activity={activityOverviewQuery.data} />
			{/if}

			<ConversationListFiltersBar {filtersState} />

			<ConversationList {conversationsQuery} {filtersState} />
		</ContentCard>
	</PageContentContainer>
{/if}
