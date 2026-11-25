<script lang="ts">
	import { onMount } from 'svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { fade } from 'svelte/transition';
	import { ArrowLeft, History } from 'lucide-svelte';
	import { goto, replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import { authStore } from '$auth/stores';
	import { AmbientBackground } from '$lib/components/utils/ambient-background';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { ExplainPhraseInline } from '$aiExplainer/shared/components/explain-phrase-inline';
	import { httpGetExplanation } from '$aiExplainer/api-client/api/http-get-explanation';
	import { explanationKeys } from '$aiExplainer/api-client/keys';
	import { explainRoute, parseExplainRouteId } from '$aiExplainer/shared/utils/explain-route';
	import { createExplanationsQuery } from '$aiExplainer/api-client/queries/use-explanations-query';
	import { E2E_TEST_IDS } from '$aiExplainer/testing/test-ids';

	const explanationsQuery = createExplanationsQuery();

	/** Saved explanations are shown for the learning language that is currently selected. */
	const language = $derived(authStore.user?.selectedLearningLanguage ?? 'ENGLISH');
	const hasHistory = $derived(
		(explanationsQuery.data ?? []).some((item) => item.language === language)
	);

	const queryClient = useQueryClient();

	let showingAnswer = $state(false);
	let activeExplanationId = $state<string | null>(null);
	/** Id whose URL is being pushed; `page.url` follows asynchronously, so a reset must not fire in between. */
	let pushedId = $state<string | null>(null);

	let explainBlock = $state<ReturnType<typeof ExplainPhraseInline> | null>(null);

	/**
	 * The address bar path. Shallow routing (a new explanation getting its URL) and browser back/forward through
	 * those entries do not reliably update `page.url`, so it is also synced from `location` directly.
	 */
	let pathname = $derived(page.url.pathname);

	/** `/explain/<id>`: every explanation has its own URL. */
	const routeId = $derived(parseExplainRouteId(pathname));
	/** The URL names a saved explanation that is not on screen yet. */
	const isOpening = $derived(routeId !== null && routeId !== activeExplanationId);

	/** `/explain?phrase=…` (e.g. from a word card) runs the explanation right away. */
	onMount(() => {
		const syncPathname = () => {
			pathname = window.location.pathname;
		};

		window.addEventListener('popstate', syncPathname);

		const phrase = page.url.searchParams.get('phrase')?.trim();

		if (phrase) {
			explainBlock?.explainPhrase(phrase);
		}

		return () => window.removeEventListener('popstate', syncPathname);
	});

	/** Opening `/explain/<id>` (from the history, a reload or a shared link) loads and shows that explanation. */
	$effect(() => {
		const id = routeId;

		if (!id || id === activeExplanationId || !explainBlock) {
			return;
		}

		let cancelled = false;

		queryClient
			.fetchQuery({ queryKey: explanationKeys.detail(id), queryFn: () => httpGetExplanation(id) })
			.then((saved) => {
				if (!cancelled) {
					explainBlock?.restoreExplanation(saved);
				}
			})
			.catch(() => {
				if (!cancelled) {
					void goto('/explain', { replace: true });
				}
			});

		return () => {
			cancelled = true;
		};
	});

	$effect(() => {
		if (pushedId && routeId === pushedId) {
			pushedId = null;
		}
	});

	/** Back on `/explain` (arrow or browser back) while an answer is still shown returns to the empty composer. */
	$effect(() => {
		if (!routeId && showingAnswer && !pushedId) {
			explainBlock?.reset();
		}
	});

	/** Leaves the explanation: back to the empty composer at `/explain`. */
	function backToComposer() {
		explainBlock?.reset();

		if (page.route.id?.endsWith('/[id]')) {
			void goto('/explain');
		} else {
			// The URL was given to this explanation by shallow routing, so the page itself stays mounted.
			void replaceState('/explain', {}).then(() => {
				pathname = window.location.pathname;
			});
		}
	}

	/** A newly requested explanation gets its own URL without reloading the page or interrupting the stream. */
	function giveExplanationItsOwnUrl(id: string) {
		pushedId = id;
		void goto(explainRoute(id), { shallow: true }).then(() => {
			pathname = window.location.pathname;
		});
	}
</script>

<svelte:head>
	<title>{m['features.ai-explainer.explain-popover.title']()}</title>
</svelte:head>

<div class="relative">
	<!-- Viewport-sized backdrop pinned while the page scrolls; the negative margin keeps it out of the layout.
		It is dropped (not just hidden) while an answer is shown, so its animations stop running. -->
	{#if !showingAnswer && !routeId}
		<div
			class="pointer-events-none sticky top-0 z-0 -mb-[100dvh] h-dvh overflow-hidden"
			aria-hidden="true"
			in:fade={{ duration: 400 }}
			out:fade={{ duration: 300 }}
		>
			<AmbientBackground contained />
		</div>
	{/if}

	{#if showingAnswer || routeId}
		<header
			class="sticky top-0 z-20 border-b border-line-subtle bg-canvas/85 backdrop-blur-sm"
			in:fade={{ duration: 250, delay: 150 }}
			out:fade={{ duration: 150 }}
		>
			<div class="mx-auto flex h-14 w-full max-w-[1200px] items-center gap-2 px-12">
				<button
					type="button"
					class="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:outline-none"
					aria-label={m['features.ai-explainer.explain-popover.back']()}
					title={m['features.ai-explainer.explain-popover.back']()}
					data-testid={E2E_TEST_IDS.explainPage.back}
					onclick={backToComposer}
				>
					<ArrowLeft class="size-5" aria-hidden="true" />
				</button>
				<span class="text-sm font-medium text-ink-muted">
					{m['features.ai-explainer.explain-popover.title']()}
				</span>
			</div>
		</header>
	{/if}

	<PageContentContainer class="relative z-10">
		<ContentCard data-testid={E2E_TEST_IDS.explainPage.root}>
			<ExplainPhraseInline
				bind:this={explainBlock}
				bind:showingAnswer
				bind:activeExplanationId
				loading={isOpening}
				onExplanationStarted={giveExplanationItsOwnUrl}
				greetingTag="h1"
			>
				{#snippet actions()}
					{#if hasHistory}
						<div class="flex justify-center">
							<a
								href="/explain/history"
								class="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-medium text-ink shadow-sm transition-colors hover:border-ink/30 hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:outline-none"
								data-testid={E2E_TEST_IDS.explainPage.historyLink}
							>
								<History class="size-4" aria-hidden="true" />
								{m['features.ai-explainer.explain-popover.history_link']()}
							</a>
						</div>
					{/if}
				{/snippet}
			</ExplainPhraseInline>
		</ContentCard>
	</PageContentContainer>
</div>
