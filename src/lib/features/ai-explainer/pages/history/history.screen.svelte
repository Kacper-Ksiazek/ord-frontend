<script lang="ts">
	import { goto } from '$app/navigation';
	import { History } from 'lucide-svelte';
	import { authStore } from '$auth/stores';
	import { Breadcrumb } from '$lib/components/navigation/breadcrumb';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import { StatusPanel } from '$lib/components/utils/status-panel';
	import * as m from '$lib/paraglide/messages.js';
	import { createDeleteExplanationsMutation } from '$aiExplainer/api-client/mutations/use-delete-explanations-mutation';
	import { createExplanationsQuery } from '$aiExplainer/api-client/queries/use-explanations-query';
	import { explainRoute } from '$aiExplainer/shared/utils/explain-route';
	import { E2E_TEST_IDS } from '$aiExplainer/testing/test-ids';
	import { ExplainHistoryList } from '$aiExplainer/shared/components/explain-history-list';

	const SKELETON_ROWS = [0, 1, 2, 3];

	const explanationsQuery = createExplanationsQuery();
	const deleteExplanations = createDeleteExplanationsMutation();

	/** Saved explanations are shown for the learning language that is currently selected. */
	const language = $derived(authStore.user?.selectedLearningLanguage ?? 'ENGLISH');
	const items = $derived(
		(explanationsQuery.data ?? []).filter((item) => item.language === language)
	);
</script>

<svelte:head>
	<title>{m['features.ai-explainer.explain-popover.history_title']()}</title>
</svelte:head>

<PageContentContainer>
	<ContentCard data-testid={E2E_TEST_IDS.explainHistoryPage.root}>
		<Breadcrumb
			class="mb-6"
			crumbs={[
				{ label: m['features.conversation.create.form.breadcrumb.home'](), href: '/' },
				{ label: m['features.ai-explainer.explain-popover.title'](), href: '/explain' },
				{ label: m['features.ai-explainer.explain-popover.history_title']() }
			]}
		/>

		<div class="mb-6 flex items-start gap-3 border-b border-line-subtle pb-6">
			<div
				class="flex size-[54px] shrink-0 items-center justify-center rounded-lg bg-accent-soft text-ink"
				aria-hidden="true"
			>
				<History class="size-5 shrink-0" />
			</div>
			<div class="min-w-0 flex-1">
				<h1 class="text-2xl font-bold tracking-tight text-ink">
					{m['features.ai-explainer.explain-popover.history_title']()}
				</h1>
				<p class="mt-1 text-sm text-ink-muted">
					{m['features.ai-explainer.explain-popover.history_description']()}
				</p>
			</div>
		</div>

		{#if explanationsQuery.isError}
			<StatusPanel
				variant="error"
				header={m['features.ai-explainer.explain-popover.history_load_error']()}
				description={explanationsQuery.error?.message ?? ''}
				primaryButton={{
					label: m['features.ai-explainer.explain-popover.history_try_again'](),
					onClick: () => explanationsQuery.refetch()
				}}
			/>
		{:else if explanationsQuery.isPending}
			<div class="flex flex-col gap-2" aria-busy="true">
				{#each SKELETON_ROWS as row (row)}
					<Skeleton class="h-[78px] w-full rounded-[10px]" />
				{/each}
			</div>
		{:else if items.length === 0}
			<StatusPanel
				variant="information"
				class="!flex-none !py-10"
				header={m['features.ai-explainer.explain-popover.history_empty_header']()}
				description={m['features.ai-explainer.explain-popover.history_empty_description']()}
				primaryButton={{
					label: m['features.ai-explainer.explain-popover.history_empty_action'](),
					onClick: () => goto('/explain')
				}}
			/>
		{:else}
			<ExplainHistoryList
				{items}
				onSelect={(item) => goto(explainRoute(item.id))}
				onRemove={(ids) => deleteExplanations.mutate(ids)}
			/>
		{/if}
	</ContentCard>
</PageContentContainer>
