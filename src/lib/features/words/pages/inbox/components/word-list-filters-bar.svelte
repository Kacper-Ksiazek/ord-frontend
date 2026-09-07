<script lang="ts">
	import Input from '$lib/components/forms/input/input.svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { DropdownMultiSelect } from '$lib/components/forms/dropdown-multi-select';
	import { WordsListFiltersState } from '../state/words-list-filters-state.svelte';
	import { createBanksQuery } from '$words/api-client';
	import { WORD_EXTRA_MARK_OPTIONS, WORD_TYPE_OPTIONS } from '$words/shared/constants/enum-values';
	import { getWordTypeSwatchDotClasses } from '$words/shared/constants/word-type-styles';
	import { getWordExtraMarkIcon } from '$words/shared/constants/word-extra-mark-styles';
	import BankGroupColorDot from '$words/shared/components/bank-group-color-dot.svelte';
	import type { WordExtraMark, WordType } from '$words/types';
	import type { DropdownMultiSelectOption } from '$lib/components/forms/dropdown-multi-select';
	import { Bookmark, SearchIcon, Tag, TrashIcon, Type } from 'lucide-svelte';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		filtersState: WordsListFiltersState;
	}

	let { filtersState }: Props = $props();

	const banksQuery = createBanksQuery();

	const bankOptions = $derived(
		(banksQuery.data ?? []).map((bank) => ({
			label: bank.name,
			value: bank.id
		}))
	);

	const bankColorById = $derived.by(() => {
		const colors = new Map<string, string>();

		for (const bank of banksQuery.data ?? []) {
			const color = bank.bankGroup?.color;
			if (color) {
				colors.set(bank.id, color);
			}
		}

		return colors;
	});

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
	<BankGroupColorDot color={bankColorById.get(option.value)} />
{/snippet}

<div
	class="mb-6 flex min-w-0 flex-wrap items-center gap-2"
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

	<DropdownMultiSelect
		dataTestId={E2E_TEST_IDS.inbox.filterWordType}
		bind:values={filtersState.filters.wordTypes}
		options={WORD_TYPE_OPTIONS}
		placeholder={m['features.words.inbox.filters.word_type_placeholder']()}
		ariaLabel={m['features.words.inbox.filters.word_type_aria']()}
		buttonClass="w-full min-w-[10rem] basis-[12rem] sm:w-[180px] sm:flex-none"
		optionLeading={wordTypeOptionLeading}
	>
		{#snippet icon()}
			<Type class="size-4 text-ink-muted" />
		{/snippet}
	</DropdownMultiSelect>

	<DropdownMultiSelect
		dataTestId={E2E_TEST_IDS.inbox.filterExtraMark}
		bind:values={filtersState.filters.wordExtraMarks}
		options={WORD_EXTRA_MARK_OPTIONS}
		placeholder={m['features.words.inbox.filters.extra_mark_placeholder']()}
		ariaLabel={m['features.words.inbox.filters.extra_mark_aria']()}
		buttonClass="w-full min-w-[10rem] basis-[12rem] sm:w-[200px] sm:flex-none"
		optionLeading={extraMarkOptionLeading}
	>
		{#snippet icon()}
			<Tag class="size-4 text-ink-muted" />
		{/snippet}
	</DropdownMultiSelect>

	{#if bankOptions.length > 0}
		<DropdownMultiSelect
			dataTestId={E2E_TEST_IDS.inbox.filterBank}
			bind:values={filtersState.filters.bankIds}
			options={bankOptions}
			placeholder={m['features.words.inbox.filters.bank_placeholder']()}
			ariaLabel={m['features.words.inbox.filters.bank_aria']()}
			buttonClass="w-full min-w-[10rem] basis-[12rem] sm:w-[180px] sm:flex-none"
			optionLeading={bankOptionLeading}
		>
			{#snippet icon()}
				<Bookmark class="size-4 text-ink-muted" />
			{/snippet}
		</DropdownMultiSelect>
	{/if}

	<IconButton
		dataTestId={E2E_TEST_IDS.inbox.filterClear}
		onClick={() => filtersState.clearFilters()}
		icon={TrashIcon}
		ariaLabel={m['features.words.inbox.filters.clear']()}
		tooltip={m['features.words.inbox.filters.clear']()}
		variant="DELETE"
		type="OUTLINED"
	/>
</div>
