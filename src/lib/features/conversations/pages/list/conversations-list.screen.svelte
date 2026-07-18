<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import {
		createConversationActivityOverviewQuery,
		createConversationsQuery
	} from '$conversations/api-client/queries';
	import { ConversationListFiltersState } from '$conversations/pages/list/state/conversation-list-state.svelte';
	import { StatusPanel } from '$lib/components/utils/status-panel';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { Breadcrumb } from '$lib/components/navigation/breadcrumb';
	import * as m from '$lib/paraglide/messages.js';
	import { Button } from '$lib/components/buttons/button';
	import { Loader } from '$lib/components/utils/loader';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';
	import ConversationList from './components/conversation-list/conversation-list.svelte';
	import ConversationListFiltersBar from './components/conversation-filters/conversation-list-filters-bar.svelte';
	import ConversationActivitySection from './components/conversation-activity/conversation-activity-section.svelte';

	const filtersState = new ConversationListFiltersState(page.url.searchParams);

	const activityOverviewQuery = createConversationActivityOverviewQuery();
	const conversationsQuery = createConversationsQuery(() => filtersState.queryPayload);

	/** Push filter changes into the URL (replaceState so filter tweaks don't spam history). */
	$effect(() => {
		const filters = filtersState.filters;
		void filters;

		if (filtersState.matchesSearchParams(page.url.searchParams)) {
			return;
		}

		const params = filtersState.toSearchParams();
		const query = params.toString();
		const href = query ? `${page.url.pathname}?${query}` : page.url.pathname;

		void goto(href, { replaceState: true, keepFocus: true, noScroll: true });
	});

	/** Hydrate filters when the user navigates with back/forward. */
	$effect(() => {
		const search = page.url.search;
		void search;
		filtersState.applyFromSearchParams(page.url.searchParams);
	});
</script>

<svelte:head>
	<title>{m['features.conversation.list.page_title']()}</title>
</svelte:head>

{#if conversationsQuery.isError}
	<StatusPanel
		variant="error"
		header={m['features.conversation.list.load_error.header']()}
		description={conversationsQuery.error?.message ||
			m['features.conversation.list.load_error.description_fallback']()}
		primaryButton={{
			label: m['features.conversation.list.load_error.try_again'](),
			onClick: () => conversationsQuery.refetch()
		}}
	/>
{:else}
	<PageContentContainer>
		<ContentCard data-testid={E2E_TEST_IDS.conversations.page}>
			<Breadcrumb
				class="mb-6"
				crumbs={[
					{ label: m['features.conversation.create.form.breadcrumb.home'](), href: '/' },
					{ label: m['features.conversation.create.form.breadcrumb.conversations']() }
				]}
			/>

			<div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1
						class="text-2xl font-bold text-gray-900 dark:text-white"
						data-testid={E2E_TEST_IDS.conversations.heading}
					>
						{m['features.conversation.list.heading']()}
					</h1>
					<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
						{m['features.conversation.list.subtitle']()}
					</p>
				</div>

				<Button
					dataTestId={E2E_TEST_IDS.conversations.newButton}
					class="w-full shrink-0 sm:w-auto"
					onClick={() => goto('/conversations/create')}
				>
					{m['features.conversation.list.new_conversation']()}
				</Button>
			</div>

			{#if activityOverviewQuery.isPending}
				<div
					class="mb-6 flex min-h-[120px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50"
					aria-busy="true"
					aria-label={m['features.conversation.list.activity.loading_aria']()}
				>
					<Loader wrapperClass="py-8" />
				</div>
			{:else if activityOverviewQuery.isError}
				<div
					class="mb-6 flex flex-col items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
					role="alert"
				>
					<p class="text-sm text-red-800 dark:text-red-200">
						{activityOverviewQuery.error?.message ??
							m['features.conversation.list.activity.error_fallback']()}
					</p>
					<Button type="OUTLINED" variant="PRIMARY" onClick={() => activityOverviewQuery.refetch()}>
						{m['features.conversation.list.activity.try_again']()}
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
