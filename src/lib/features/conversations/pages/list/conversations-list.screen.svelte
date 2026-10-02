<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate, goto, replaceState } from '$app/navigation';
	import {
		createConversationActivityOverviewQuery,
		createConversationsQuery
	} from '$conversations/api-client/queries';
	import { ConversationListFiltersState } from '$conversations/pages/list/state/conversation-list-state.svelte';
	import {
		buildConversationsListQueryString,
		parseConversationsListViewModeFromSearchParams
	} from '$conversations/pages/list/state/conversations-list-url-state';
	import type { ConversationsListViewMode } from '$conversations/types';
	import { StatusPanel } from '$lib/components/utils/status-panel';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { Breadcrumb } from '$lib/components/navigation/breadcrumb';
	import * as m from '$lib/paraglide/messages.js';
	import { Button } from '$lib/components/buttons/button';
	import { Plus } from 'lucide-svelte';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';
	import { preserveModalQueryParam } from '$lib/utils/url/modal-query';
	import ConversationActivitySectionSkeleton from './components/conversation-activity/conversation-activity-section-skeleton.svelte';
	import ConversationList from './components/conversation-list/conversation-list.svelte';
	import ConversationListFiltersBar from './components/conversation-filters/conversation-list-filters-bar.svelte';
	import ConversationActivitySection from './components/conversation-activity/conversation-activity-section.svelte';
	import ConversationsViewToggle from './components/conversations-view-toggle.svelte';

	const filtersState = new ConversationListFiltersState(page.url.searchParams);

	let viewMode = $state<ConversationsListViewMode>(
		parseConversationsListViewModeFromSearchParams(page.url.searchParams)
	);

	const activityOverviewQuery = createConversationActivityOverviewQuery(
		() => viewMode === 'summary'
	);
	const conversationsQuery = createConversationsQuery(() => filtersState.queryPayload);

	const headerDescription = $derived(
		viewMode === 'summary'
			? m['features.conversation.list.summary_description']()
			: m['features.conversation.list.subtitle']()
	);

	/** Filters are the source of truth. Hydrating from `page.url` on every change races
	 *  `replaceState` and wipes in-progress search/type. Only apply URL on back/forward. */
	afterNavigate((navigation) => {
		if (navigation.type !== 'popstate') {
			return;
		}

		filtersState.applyFromSearchParams(page.url.searchParams);
		viewMode = parseConversationsListViewModeFromSearchParams(page.url.searchParams);
	});

	$effect(() => {
		const filtersQuery = filtersState.toQueryString();
		const query = preserveModalQueryParam(
			buildConversationsListQueryString(filtersQuery, viewMode),
			window?.location.search ?? ''
		);
		const desiredSearch = query ? `?${query}` : '';

		// `replaceState` updates history but not `$app/state` `page.url` — compare the real location.
		if (window.location.search === desiredSearch) {
			return;
		}

		replaceState(desiredSearch === '' ? '?' : desiredSearch, {});
	});

	function handleViewModeChange(mode: ConversationsListViewMode) {
		viewMode = mode;
	}
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

			<div
				class="mb-6 flex flex-col gap-3 border-b border-line-subtle pb-6 sm:flex-row sm:items-end sm:justify-between"
			>
				<div>
					<h1
						class="text-2xl font-bold tracking-tight text-ink"
						data-testid={E2E_TEST_IDS.conversations.heading}
					>
						{m['features.conversation.list.heading']()}
					</h1>
					<p class="mt-1 text-sm text-ink-muted">
						{headerDescription}
					</p>
				</div>

				<div class="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
					<ConversationsViewToggle {viewMode} onViewModeChange={handleViewModeChange} />

					<Button
						dataTestId={E2E_TEST_IDS.conversations.newButton}
						class="w-full shrink-0 gap-2 sm:w-auto"
						onClick={() => goto('/conversations/create')}
					>
						<Plus class="size-4 shrink-0" aria-hidden="true" />
						{m['features.conversation.list.new_conversation']()}
					</Button>
				</div>
			</div>

			{#if viewMode === 'summary'}
				{#if activityOverviewQuery.isPending}
					<ConversationActivitySectionSkeleton />
				{:else if activityOverviewQuery.isError}
					<div
						class="mb-6 flex flex-col items-start gap-3 rounded-[10px] border border-danger/25 bg-danger/5 p-4"
						role="alert"
					>
						<p class="text-sm text-danger">
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
			{:else}
				<ConversationListFiltersBar {filtersState} />

				<ConversationList {conversationsQuery} {filtersState} />
			{/if}
		</ContentCard>
	</PageContentContainer>
{/if}
