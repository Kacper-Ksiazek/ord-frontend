<script lang="ts">
	import { Badge } from '$lib/components/utils/badge';
	import { parseEmphasisTextForHeadword } from '$lib/utils/text/parse-emphasis-text';
	import { getWordTypeBadgeColor, getWordTypeLabel } from '$words/shared/constants';
	import BankGroupColorDot from '$words/shared/components/bank-group-color-dot.svelte';
	import WordExtraMarkBadge from '$words/shared/components/word-extra-mark-badge.svelte';
	import { cn } from '$lib/utils/cn';
	import type { WordExtraMark, WordListItem, WordType } from '$words/types';

	type WordRowItem = {
		sourceWord?: string | null;
		translation?: string | null;
		definition?: string | null;
		type?: WordType | null;
		extraMark?: WordExtraMark | null;
		bank?: WordListItem['bank'];
	};

	interface Props {
		item: WordRowItem;
		itemId: string;
		compact?: boolean;
		/** When set, clamps the definition paragraph to this many lines (e.g. home previews). */
		definitionLineClamp?: number;
	}

	let { item, compact = false, definitionLineClamp }: Props = $props();

	const sourceWord = $derived(item.sourceWord ?? '');
	const showTrailingMeta = $derived(Boolean(item.bank?.name));
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
			{/if}
		</div>
	{:else}
		<div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
			<p class="min-w-0 text-base leading-snug">
				<span class="font-semibold text-ink">{sourceWord}</span>

				{#if item.translation}
					<span class="px-1 text-ink-subtle" aria-hidden="true">·</span>
					<span class="text-ink-muted">{item.translation}</span>
				{/if}
			</p>

			{#if item.type}
				<Badge color={getWordTypeBadgeColor(item.type)}>{getWordTypeLabel(item.type)}</Badge>
			{/if}

			{#if item.extraMark}
				<WordExtraMarkBadge mark={item.extraMark} />
			{/if}

			{#if showTrailingMeta}
				<div class="ml-auto flex max-w-full flex-wrap items-center justify-end gap-1.5">
					{#if item.bank?.name}
						<span
							class="inline-flex max-w-full items-center gap-1.5 rounded-[10px] bg-accent-soft px-2 py-0.5 text-xs font-medium text-ink-muted"
							title={item.bank.bankGroup?.name ?? undefined}
						>
							<BankGroupColorDot color={item.bank.bankGroup?.color} />
							<span class="truncate">{item.bank.name}</span>
						</span>
					{/if}
				</div>
			{/if}
		</div>

		{#if item.definition}
			<p
				class={cn(
					'text-sm leading-relaxed text-ink-muted',
					definitionLineClamp === 1 && 'line-clamp-1 min-w-0',
					definitionLineClamp === 2 && 'line-clamp-2 min-w-0'
				)}
				title={definitionLineClamp != null ? item.definition : undefined}
			>
				{#each parseEmphasisTextForHeadword(item.definition, sourceWord) as part, index (index)}
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
