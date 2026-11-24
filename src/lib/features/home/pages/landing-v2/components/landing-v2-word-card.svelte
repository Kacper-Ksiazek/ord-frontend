<script lang="ts">
	import { ChevronRight, Sparkles } from 'lucide-svelte';
	import { PhraseExamplesStream } from '$aiExplainer';
	import { getWordTypeBadgeColor, getWordTypeLabel } from '$words/shared/constants';
	import WordExtraMarkBadge from '$words/shared/components/word-extra-mark-badge.svelte';
	import { Badge } from '$lib/components/utils/badge';
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
	import type { WordListItem } from '$words';
	import type { LanguageName } from '$lib/types/core/domain/languages';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		word: WordListItem;
		language: LanguageName;
		onExplain: (phrase: string) => void;
	}

	let { word, language, onExplain }: Props = $props();

	const id = $derived(word.id ?? '');
	const sourceWord = $derived(word.sourceWord ?? '');
	const definition = $derived(word.definition?.trim() || word.translation?.trim() || sourceWord);
</script>

<article
	class="flex w-full min-w-0 flex-col gap-4 rounded-[10px] border border-line bg-surface p-4"
	data-testid={E2E_TEST_IDS.landingV2.recentWordCard(id)}
>
	<header class="flex flex-col gap-1.5">
		<div class="flex items-start justify-between gap-3">
			<h3 class="min-w-0 text-2xl leading-tight font-semibold tracking-tight break-words text-ink">
				{sourceWord}
			</h3>
			{#if word.type || word.extraMark}
				<div class="flex shrink-0 flex-wrap items-center justify-end gap-1.5 pt-1">
					{#if word.type}
						<Badge color={getWordTypeBadgeColor(word.type)}>{getWordTypeLabel(word.type)}</Badge>
					{/if}
					{#if word.extraMark}
						<WordExtraMarkBadge mark={word.extraMark} />
					{/if}
				</div>
			{/if}
		</div>
		{#if word.translation}
			<p class="text-sm leading-snug text-ink-muted">{word.translation}</p>
		{/if}
	</header>

	<div class="flex-1">
		<PhraseExamplesStream phrase={sourceWord} {language} {definition} />
	</div>

	<div class="flex items-center justify-between gap-2 border-t border-line-subtle pt-3 text-sm">
		<a
			href="/words"
			class="inline-flex items-center gap-1 text-ink-muted underline-offset-2 hover:text-ink hover:underline"
		>
			{m['features.home.landing-v2.word_open']()}
			<ChevronRight class="size-4 shrink-0" aria-hidden="true" />
		</a>
		<button
			type="button"
			class="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-ink-muted transition-colors hover:bg-accent-soft hover:text-ink"
			data-testid={E2E_TEST_IDS.landingV2.recentWordExplain(id)}
			onclick={() => onExplain(sourceWord)}
		>
			<Sparkles class="size-4 shrink-0" aria-hidden="true" />
			{m['features.home.landing-v2.word_explain']()}
		</button>
	</div>
</article>
