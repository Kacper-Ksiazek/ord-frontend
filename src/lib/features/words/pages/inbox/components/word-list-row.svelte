<script lang="ts">
	import { Badge } from '$lib/components/utils/badge';
	import { parseEmphasisText } from '$lib/utils/text/parse-emphasis-text';
	import {
		getWordExtraMarkLabel,
		getWordTypeBadgeColor,
		getWordTypeLabel
	} from '$words/shared/constants';
	import type { WordListItem, WordsViewMode } from '$words/types';
	import * as m from '$lib/paraglide/messages.js';
	import { Bookmark } from 'lucide-svelte';
	import CapturedStatusBadge from './captured-status-badge.svelte';

	interface Props {
		item: WordListItem;
		itemId: string;
		variant: WordsViewMode;
		compact?: boolean;
	}

	let { item, itemId, variant, compact = false }: Props = $props();

	const sourceWord = $derived(item.sourceWord ?? '');
	const showRightMeta = $derived(
		item.extraMark || item.bank?.name || (variant === 'pending' && item.fromUnverifiedSource)
	);
</script>

<div class={compact ? 'min-w-0 flex-1' : 'min-w-0 flex-1 flex flex-col gap-2.5'}>
	{#if compact}
		<div class="flex min-w-0 flex-col gap-0.5">
			<div class="flex min-w-0 items-center justify-between gap-2">
				<p class="min-w-0 truncate text-sm font-semibold leading-snug text-ink">{sourceWord}</p>
				{#if item.type}
					<Badge color={getWordTypeBadgeColor(item.type)} class="shrink-0">
						{getWordTypeLabel(item.type)}
					</Badge>
				{/if}
			</div>

			{#if item.translation}
				<p class="min-w-0 truncate text-sm leading-snug text-ink-muted">{item.translation}</p>
			{:else if variant === 'pending'}
				<p class="text-sm leading-snug text-ink-subtle italic">
					{m['features.words.inbox.row.missing_translation']()}
				</p>
			{/if}
		</div>
	{:else}
		<div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
			<p class="min-w-0 text-base leading-snug">
				<span class="font-semibold text-ink">{sourceWord}</span>

				{#if item.translation}
					<span class="px-1 text-ink-subtle" aria-hidden="true">·</span>
					<span class="text-ink-muted">{item.translation}</span>
				{:else if variant === 'pending'}
					<span class="px-1 text-ink-subtle" aria-hidden="true">·</span>
					<span class="text-ink-subtle italic"
						>{m['features.words.inbox.row.missing_translation']()}</span
					>
				{/if}
			</p>

			{#if item.type}
				<Badge color={getWordTypeBadgeColor(item.type)}>{getWordTypeLabel(item.type)}</Badge>
			{/if}

			{#if item.bookmarked}
				<span
					class="inline-flex rounded-[10px] bg-accent-soft p-1 text-highlight"
					title={m['features.words.inbox.row.bookmarked']()}
					aria-label={m['features.words.inbox.row.bookmarked']()}
				>
					<Bookmark class="size-3.5 fill-current" aria-hidden="true" />
				</span>
			{/if}

			{#if showRightMeta}
				<div class="ml-auto flex max-w-full flex-wrap items-center justify-end gap-1.5">
					{#if item.extraMark}
						<Badge color="gray">{getWordExtraMarkLabel(item.extraMark)}</Badge>
					{/if}

					{#if item.bank?.name}
						<span
							class="inline-flex max-w-full items-center gap-1.5 rounded-[10px] bg-accent-soft px-2 py-0.5 text-xs font-medium text-ink-muted"
							title={item.bank.bankGroup?.name ?? undefined}
						>
							{#if item.bank.bankGroup?.color}
								<span
									class="size-2 shrink-0 rounded-full"
									style:background-color={item.bank.bankGroup.color}
									aria-hidden="true"
								></span>
							{/if}
							<span class="truncate">{item.bank.name}</span>
						</span>
					{/if}

					{#if variant === 'pending' && item.fromUnverifiedSource}
						<CapturedStatusBadge {itemId} />
					{/if}
				</div>
			{/if}
		</div>

		{#if item.definition}
			<p class="text-sm leading-relaxed text-ink-muted">
				{#each parseEmphasisText(item.definition) as part, index (index)}
					{#if part.emphasized}
						<span class="rounded-md bg-highlight/90 px-1 py-px font-medium text-ink">{part.text}</span>
					{:else}
						{part.text}
					{/if}
				{/each}
			</p>
		{/if}
	{/if}
</div>
