<script lang="ts">
	import { BookOpen } from 'lucide-svelte';
	import { Carousel } from '$lib/components/navigation/carousel';
	import { StatusPanel } from '$lib/components/utils/status-panel';
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
	import type { WordListItem } from '$words';
	import type { LanguageName } from '$lib/types/core/domain/languages';
	import * as m from '$lib/paraglide/messages.js';
	import LandingV2WordCard from './landing-v2-word-card.svelte';

	const SKELETON_COUNT = 3;

	interface Props {
		words: WordListItem[];
		language: LanguageName;
		isPending: boolean;
		onExplain: (phrase: string) => void;
	}

	let { words, language, isPending, onExplain }: Props = $props();

	const skeletonSlots = Array.from({ length: SKELETON_COUNT }, (_, index) => index);
</script>

{#snippet heading()}
	<div class="flex min-w-0 items-start gap-2">
		<BookOpen class="mt-0.5 size-5 shrink-0 text-ink-muted" aria-hidden="true" />
		<div class="min-w-0">
			<h2 class="text-base font-semibold tracking-tight text-ink">
				{m['features.home.landing-v2.recent_words_title']()}
			</h2>
			<p class="text-sm text-ink-muted">
				{m['features.home.landing-v2.recent_words_description']()}
			</p>
		</div>
	</div>
{/snippet}

{#snippet wordSlide(word: WordListItem)}
	<LandingV2WordCard {word} {language} {onExplain} />
{/snippet}

{#if isPending || words.length === 0}
	<section class="flex flex-col gap-3" data-testid={E2E_TEST_IDS.landingV2.recentWordsSection}>
		{@render heading()}

		{#if isPending}
			<div
				class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
				data-testid={E2E_TEST_IDS.landingV2.recentWordsSkeleton}
				aria-busy="true"
			>
				{#each skeletonSlots as slot (slot)}
					<div class="flex flex-col gap-4 rounded-[10px] border border-line bg-surface p-4">
						<Skeleton class="h-7 w-1/2 rounded-md" />
						<Skeleton class="h-3 w-1/3 rounded-full" />
						<Skeleton class="mt-3 h-2.5 w-full rounded-full" />
						<Skeleton class="h-2.5 w-4/5 rounded-full" />
					</div>
				{/each}
			</div>
		{:else}
			<div data-testid={E2E_TEST_IDS.landingV2.recentWordsEmpty}>
				<StatusPanel
					variant="information"
					class="!flex-none !py-10"
					header={m['features.home.landing-v2.recent_words_empty.header']()}
					description={m['features.home.landing-v2.recent_words_empty.description']()}
				/>
			</div>
		{/if}
	</section>
{:else}
	<Carousel
		items={words}
		getKey={(word, index) => word.id ?? String(index)}
		slide={wordSlide}
		header={heading}
		ariaLabel={m['features.home.landing-v2.recent_words_title']()}
		previousLabel={m['features.home.landing-v2.carousel_previous']()}
		nextLabel={m['features.home.landing-v2.carousel_next']()}
		dataTestId={E2E_TEST_IDS.landingV2.recentWordsSection}
	/>
{/if}
