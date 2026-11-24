<script lang="ts">
	import { ExplainPhraseInline } from '$aiExplainer';
	import { authStore } from '$auth/stores';
	import { createWordsQuery } from '$words';
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { StatusPanel } from '$lib/components/utils/status-panel';
	import * as m from '$lib/paraglide/messages.js';
	import LandingV2RecentWords from './components/landing-v2-recent-words.svelte';
	import LandingV2QuickActions from './components/landing-v2-quick-actions.svelte';

	/** The words list is ordered newest first, so the first page holds the latest words. */
	const RECENT_WORDS_COUNT = 6;

	const language = $derived(authStore.user?.selectedLearningLanguage ?? 'ENGLISH');
	const wordsQuery = createWordsQuery(() => ({ language, page: 0, perPage: RECENT_WORDS_COUNT }));
	const recentWords = $derived(wordsQuery.data?.data ?? []);
	const wordsTotal = $derived(wordsQuery.data?.pagination?.totalResults ?? null);

	let explainBlock = $state<ReturnType<typeof ExplainPhraseInline> | null>(null);
</script>

<svelte:head>
	<title>{m['features.home.landing-v2.page_title']()}</title>
</svelte:head>

<PageContentContainer class="max-w-[1440px]">
	<ContentCard data-testid={E2E_TEST_IDS.landingV2.page}>
		<div class="flex flex-col gap-8">
			<ExplainPhraseInline bind:this={explainBlock} greetingTag="h1">
				{#snippet actions()}
					<LandingV2QuickActions {wordsTotal} />
				{/snippet}
			</ExplainPhraseInline>

			{#if wordsQuery.isError}
				<StatusPanel
					variant="error"
					header={m['features.home.landing-v2.load_error.header']()}
					description={wordsQuery.error?.message ||
						m['features.home.home.load_error.description_fallback']()}
					primaryButton={{
						label: m['features.home.landing-v2.load_error.try_again'](),
						onClick: () => wordsQuery.refetch()
					}}
				/>
			{:else}
				<LandingV2RecentWords
					words={recentWords}
					{language}
					isPending={wordsQuery.isPending}
					onExplain={(phrase) => explainBlock?.explainPhrase(phrase)}
				/>
			{/if}
		</div>
	</ContentCard>
</PageContentContainer>
