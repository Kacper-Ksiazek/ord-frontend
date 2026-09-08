<script lang="ts">
	import Input from '$lib/components/forms/input/input.svelte';
	import { DropdownMultiSelect } from '$lib/components/forms/dropdown-multi-select';
	import { WordsListFiltersState } from '../state/words-list-filters-state.svelte';
	import { createBanksQuery } from '$words/api-client';
	import { WORD_EXTRA_MARK_OPTIONS, WORD_TYPE_OPTIONS } from '$words/shared/constants/enum-values';
	import { getWordTypeSwatchDotClasses } from '$words/shared/constants/word-type-styles';
	import { getWordExtraMarkIcon } from '$words/shared/constants/word-extra-mark-styles';
	import BankGroupColorDot from '$words/shared/components/bank-group-color-dot.svelte';
	import type { WordExtraMark, WordType } from '$words/types';
	import type { DropdownMultiSelectOption } from '$lib/components/forms/dropdown-multi-select';
	import { Bookmark, Heart, RotateCcw, SearchIcon, Tag, Type } from 'lucide-svelte';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';
	import * as m from '$lib/paraglide/messages.js';
	import { cn } from '$lib/utils/cn';

	interface Props {
		filtersState: WordsListFiltersState;
		isSplitView?: boolean;
		bookmarkedCount?: number;
	}

	let { filtersState, isSplitView = false, bookmarkedCount = 0 }: Props = $props();

	const banksQuery = createBanksQuery();

	const bankOptions = $derived(
		(banksQuery.data ?? []).map((bank) => ({
			label: bank.name,
			value: bank.id
		}))
	);

	const bankColorById = $derived.by(() => {
		const colors: Record<string, string> = {};

		for (const bank of banksQuery.data ?? []) {
			const color = bank.bankGroup?.color;
			if (color) {
				colors[bank.id] = color;
			}
		}

		return colors;
	});

	function formatCount(count: number): string {
		return count > 99 ? '99+' : String(count);
	}

	function bookmarkedBadgeClass(isActive: boolean): string {
		return isActive ? 'bg-surface text-ink' : 'bg-accent-soft text-ink-muted';
	}

	function bookmarkedHeartClass(isActive: boolean): string {
		return isActive ? 'fill-current text-score-low' : 'text-ink-muted';
	}

	type WordTypeOption = DropdownMultiSelectOption<WordType>;
	type ExtraMarkOption = DropdownMultiSelectOption<WordExtraMark>;
	type BankOption = DropdownMultiSelectOption<string>;
</script>

{#snippet wordTypeOptionLeading(option: WordTypeOption)}
	<span class={getWordTypeSwatchDotClasses(option.value)} aria-hidden="true"></span>
{/snippet}

{#snippet extraMarkOptionLeading(option: ExtraMarkOption)}
	{@const Icon = getWordExtraMarkIcon(option.value)}
	<Icon class="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
{/snippet}

{#snippet bankOptionLeading(option: BankOption)}
	<BankGroupColorDot color={bankColorById[option.value]} />
{/snippet}

{#snippet wordTypeFilter(buttonClass: string)}
	<DropdownMultiSelect
		dataTestId={E2E_TEST_IDS.inbox.filterWordType}
		bind:values={filtersState.filters.wordTypes}
		options={WORD_TYPE_OPTIONS}
		placeholder={m['features.words.inbox.filters.word_type_placeholder']()}
		ariaLabel={m['features.words.inbox.filters.word_type_aria']()}
		{buttonClass}
		optionLeading={wordTypeOptionLeading}
	>
		{#snippet icon()}
			<Type class="size-4 text-ink-muted" />
		{/snippet}
	</DropdownMultiSelect>
{/snippet}

{#snippet extraMarkFilter(buttonClass: string)}
	<DropdownMultiSelect
		dataTestId={E2E_TEST_IDS.inbox.filterExtraMark}
		bind:values={filtersState.filters.wordExtraMarks}
		options={WORD_EXTRA_MARK_OPTIONS}
		placeholder={m['features.words.inbox.filters.extra_mark_placeholder']()}
		ariaLabel={m['features.words.inbox.filters.extra_mark_aria']()}
		{buttonClass}
		optionLeading={extraMarkOptionLeading}
	>
		{#snippet icon()}
			<Tag class="size-4 text-ink-muted" />
		{/snippet}
	</DropdownMultiSelect>
{/snippet}

{#snippet bankFilter(buttonClass: string)}
	{#if bankOptions.length > 0}
		<DropdownMultiSelect
			dataTestId={E2E_TEST_IDS.inbox.filterBank}
			bind:values={filtersState.filters.bankIds}
			options={bankOptions}
			placeholder={m['features.words.inbox.filters.bank_placeholder']()}
			ariaLabel={m['features.words.inbox.filters.bank_aria']()}
			{buttonClass}
			optionLeading={bankOptionLeading}
		>
			{#snippet icon()}
				<Bookmark class="size-4 text-ink-muted" />
			{/snippet}
		</DropdownMultiSelect>
	{/if}
{/snippet}

{#snippet bookmarkedOnlyToggle()}
	<button
		type="button"
		role="switch"
		aria-checked={filtersState.filters.bookmarkedOnly}
		aria-label={m['features.words.inbox.filters.bookmarked_only_aria']()}
		data-testid={E2E_TEST_IDS.inbox.filterBookmarkedOnly}
		class={cn(
			'inline-flex h-[40px] shrink-0 items-center gap-2 rounded-[10px] border px-2.5 text-sm font-medium transition-colors',
			filtersState.filters.bookmarkedOnly
				? 'border-line bg-accent-soft text-ink'
				: 'border-line bg-surface text-ink-muted hover:bg-accent-soft hover:text-ink'
		)}
		onclick={() => {
			filtersState.filters.bookmarkedOnly = !filtersState.filters.bookmarkedOnly;
		}}
	>
		<Heart
			class={cn('size-4 shrink-0', bookmarkedHeartClass(filtersState.filters.bookmarkedOnly))}
			aria-hidden="true"
		/>
		<span class="whitespace-nowrap">{m['features.words.inbox.filters.bookmarked_only']()}</span>
		{#if bookmarkedCount > 0}
			<span
				class={cn(
					'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums',
					bookmarkedBadgeClass(filtersState.filters.bookmarkedOnly)
				)}
				data-testid={E2E_TEST_IDS.inbox.filterBookmarkedCount}
			>
				{formatCount(bookmarkedCount)}
			</span>
		{/if}
	</button>
{/snippet}

{#snippet clearFiltersButton()}
	<button
		type="button"
		data-testid={E2E_TEST_IDS.inbox.filterClear}
		aria-label={m['features.words.inbox.filters.clear']()}
		title={m['features.words.inbox.filters.clear']()}
		disabled={!filtersState.hasActiveFilters}
		class={cn(
			'inline-flex size-[40px] shrink-0 items-center justify-center rounded-[10px] border transition-colors',
			'border-line bg-surface text-ink-muted hover:bg-accent-soft hover:text-ink',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20',
			!filtersState.hasActiveFilters &&
				'cursor-not-allowed opacity-40 hover:bg-surface hover:text-ink-muted'
		)}
		onclick={() => filtersState.clearFilters()}
	>
		<RotateCcw class="size-4 shrink-0" aria-hidden="true" />
	</button>
{/snippet}

{#if isSplitView}
	<div class="mb-4 flex min-w-0 flex-col gap-2" data-testid={E2E_TEST_IDS.inbox.filters}>
		<Input
			dataTestId={E2E_TEST_IDS.inbox.filterSearch}
			debounced
			bind:value={filtersState.filters.search}
			type="search"
			placeholder={m['features.words.inbox.filters.search_placeholder']()}
			class="w-full"
			leftAdornment={SearchIcon}
		/>

		<div class="grid grid-cols-2 gap-2">
			<div class="min-w-0">
				{@render wordTypeFilter('w-full min-w-0')}
			</div>
			<div class="min-w-0">
				{@render extraMarkFilter('w-full min-w-0')}
			</div>
		</div>

		<div class="min-w-0">
			{@render bankFilter('w-full min-w-0')}
		</div>

		<div class="flex items-center justify-between gap-2">
			{@render bookmarkedOnlyToggle()}
			{@render clearFiltersButton()}
		</div>
	</div>
{:else}
	<div
		class="mb-4 flex min-w-0 flex-wrap items-center gap-2"
		data-testid={E2E_TEST_IDS.inbox.filters}
	>
		<Input
			dataTestId={E2E_TEST_IDS.inbox.filterSearch}
			debounced
			bind:value={filtersState.filters.search}
			type="search"
			placeholder={m['features.words.inbox.filters.search_placeholder']()}
			class="min-w-[12rem] flex-1 basis-[16rem]"
			leftAdornment={SearchIcon}
		/>

		<div class="w-[180px] min-w-0 shrink-0">
			{@render wordTypeFilter('w-full min-w-0')}
		</div>

		<div class="w-[200px] min-w-0 shrink-0">
			{@render extraMarkFilter('w-full min-w-0')}
		</div>

		<div class="w-[180px] min-w-0 shrink-0">
			{@render bankFilter('w-full min-w-0')}
		</div>

		{@render bookmarkedOnlyToggle()}
		{@render clearFiltersButton()}
	</div>
{/if}
