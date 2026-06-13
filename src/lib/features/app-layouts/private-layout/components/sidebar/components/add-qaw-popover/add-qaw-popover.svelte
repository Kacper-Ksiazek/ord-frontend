<script lang="ts">
	import { flip, shift } from '@floating-ui/dom';
	import { Button } from '$lib/components/actions/button';
	import { AiActionButton } from '$lib/components/actions/ai-action-button';
	import type { AiActionButtonStatus } from '$lib/components/actions/ai-action-button/ai-action-button.types';
	import { Input } from '$lib/components/forms/input';
	import { cn, Popover, Toggle } from 'flowbite-svelte';
	import {
		ADD_QAW_POPOVER_MAX_COUNT,
		ADD_QAW_POPOVER_ROW_HEIGHT_PX,
		ADD_QAW_POPOVER_SCROLL_FROM_COUNT,
		ADD_QAW_POPOVER_TRIGGER_ID
	} from './add-qaw-popover.constants';
	import { addQAWPopoverStore } from './add-qaw-popover.store.svelte';
	import { tick } from 'svelte';
	import { ArrowLeftRight, BinaryIcon, CirclePlus, EyeIcon, Minus, Plus, X } from 'lucide-svelte';
	import SidebarLink from '../sidebar-link.svelte';
	import IconButton from '$lib/components/actions/icon-button/icon-button.svelte';
	import DropdownSelect from '$lib/components/forms/dropdown-select/dropdown-select.svelte';
	import type { DropdownSelectOption } from '$lib/components/forms/dropdown-select';
	import { WordTypeOptions } from '$lib/types/word/domain/constants';
	import { getWordTypeSwatchClasses } from '$lib/types/word';
	import { Divider } from '$lib/components/surfaces/divider';
	import { AutoHeightTextarea } from '$lib/components/forms/auto-height-textarea';
	import {
		createBulkCreateQawMutation,
		createQawFillGapsMutation
	} from '$lib/api-client/quickly-added-words/mutations';
	import { authStore } from '$lib/stores/auth.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import {
		applyFillResultToRow,
		buildBulkCreatePayload,
		collectFillGapsItems
	} from './add-qaw-fill-gaps.utils';
	import type { QAWFillGapsRowErrorCode } from '$lib/types/quickly-added-word/api/fill-gaps';
	import { isAxiosError } from 'axios';

	const SIDEBAR_POPOVER_VIEWPORT_MARGIN = 120;

	const sidebarPopoverMiddlewares = [
		flip({ padding: SIDEBAR_POPOVER_VIEWPORT_MARGIN }),
		shift({ padding: SIDEBAR_POPOVER_VIEWPORT_MARGIN })
	];

	const sidebarPopoverClass = cn(
		'ml-4.5 w-[866px] max-w-[920px] py-2 px-3',
		'bg-black dark:bg-black text-white shadow-none',
		'border border-gray-800 dark:border-gray-800',
		'divide-gray-800 dark:divide-gray-800'
	);

	const sidebarFieldClass = cn(
		'bg-gray-900 hover:bg-gray-900 border-gray-800',
		'text-gray-200 placeholder:text-gray-400/80',
		'focus:border-gray-400 focus:ring-gray-600 focus:ring-offset-black'
	);

	const sidebarFieldTextClass = 'text-gray-200 placeholder:text-gray-400/80';
	const sidebarAdornmentClass = 'text-gray-400';

	const sidebarDropdownMenuClass = cn(
		'bg-gray-900 border-gray-800',
		'[&_button]:text-gray-200 [&_button:hover]:bg-gray-800',
		'[&_button.font-semibold]:bg-primary-900 [&_button.font-semibold]:text-gray-100'
	);

	const sidebarToggleSpanClass = cn(
		'bg-gray-600 after:border-gray-500',
		'peer-focus:ring-primary-800'
	);

	const sidebarAddMoreButtonClass = cn(
		'border-0 pl-0 text-gray-300',
		'hover:bg-white/10 hover:text-white',
		'focus:ring-offset-black focus:ring-gray-600'
	);

	const sidebarResetButtonClass = cn(
		'border-0 text-red-400',
		'hover:bg-red-900/30 hover:text-red-300',
		'focus:ring-offset-black focus:ring-red-800'
	);

	const recordsScrollMaxHeightPx =
		(ADD_QAW_POPOVER_SCROLL_FROM_COUNT - 1) * ADD_QAW_POPOVER_ROW_HEIGHT_PX;

	const fillGapsMutation = createQawFillGapsMutation();
	const bulkCreateMutation = createBulkCreateQawMutation();

	let recordsScrollEl: HTMLDivElement | undefined = $state();
	let isOpen = $state(false);
	let fillButtonStatus = $state<AiActionButtonStatus>('default');
	let fillGlobalError = $state<string | null>(null);
	let saveValidationError = $state<string | null>(null);

	const learningLanguage = $derived(authStore.user?.selectedLearningLanguage ?? undefined);

	const isRecordsScrollable = $derived(
		addQAWPopoverStore.values.length >= ADD_QAW_POPOVER_SCROLL_FROM_COUNT
	);

	const hasWordToFill = $derived(
		addQAWPopoverStore.values.some((row) => row.word.trim().length > 0)
	);

	const isBusy = $derived(fillGapsMutation.isPending || bulkCreateMutation.isPending);

	const fillProgressLabel = $derived.by(() => {
		const count = addQAWPopoverStore.values.filter((row) => row.word.trim()).length;

		return m['features.app-layouts.add-qaw-popover.fill_progress']({ count });
	});

	async function handleAddMore() {
		addQAWPopoverStore.addEmptyRecord();
		await tick();
		recordsScrollEl?.scrollTo({ top: recordsScrollEl.scrollHeight, behavior: 'smooth' });
	}

	function getFillValidationMessage(
		reason: 'no_words' | 'too_many_words' | 'word_too_long'
	): string {
		switch (reason) {
			case 'no_words':
				return m['features.app-layouts.add-qaw-popover.fill_validation.no_words']();
			case 'word_too_long':
				return m['features.app-layouts.add-qaw-popover.fill_validation.word_too_long']();
			case 'too_many_words':
				return m['features.app-layouts.add-qaw-popover.fill_validation.too_many_words']();
		}
	}

	function getRowFillErrorMessage(code: string): string {
		if (code === 'NON_EXISTENT_WORD') {
			return m['features.app-layouts.add-qaw-popover.fill_row_errors.NON_EXISTENT_WORD']();
		}
		if (code === 'AMBIGUOUS_WORD') {
			return m['features.app-layouts.add-qaw-popover.fill_row_errors.AMBIGUOUS_WORD']();
		}

		return m['features.app-layouts.add-qaw-popover.fill_row_errors.unknown']();
	}

	function handleFillWithAi() {
		saveValidationError = null;
		fillGlobalError = null;

		const collected = collectFillGapsItems(addQAWPopoverStore.values);
		if (!collected.ok) {
			fillGlobalError = getFillValidationMessage(collected.reason);
			fillButtonStatus = 'failed';

			return;
		}

		if (!learningLanguage) {
			fillGlobalError = m['features.app-layouts.add-qaw-popover.save_no_language']();
			fillButtonStatus = 'failed';

			return;
		}

		addQAWPopoverStore.clearAiErrors();
		fillButtonStatus = 'loading';

		fillGapsMutation.mutate(
			{ language: learningLanguage, items: collected.items },
			{
				onSuccess: (response) => {
					for (let i = 0; i < response.items.length; i++) {
						const rowIndex = collected.rowIndices[i];
						applyFillResultToRow(addQAWPopoverStore.values[rowIndex], response.items[i]);
					}
					fillButtonStatus = 'success';
				},
				onError: (error) => {
					fillButtonStatus = 'failed';
					if (isAxiosError(error) && error.response?.status === 400) {
						const message =
							typeof error.response.data === 'object' &&
							error.response.data !== null &&
							'message' in error.response.data &&
							typeof error.response.data.message === 'string'
								? error.response.data.message
								: null;
						fillGlobalError = message ?? m['features.app-layouts.add-qaw-popover.fill_global_error']();

						return;
					}
					fillGlobalError = m['features.app-layouts.add-qaw-popover.fill_global_error']();
				}
			}
		);
	}

	function handleSave() {
		fillGlobalError = null;
		saveValidationError = null;

		if (!learningLanguage) {
			saveValidationError = m['features.app-layouts.add-qaw-popover.save_no_language']();

			return;
		}

		const payload = buildBulkCreatePayload(addQAWPopoverStore.values, learningLanguage);
		if (payload.length === 0) {
			saveValidationError = m['features.app-layouts.add-qaw-popover.save_no_words']();

			return;
		}

		bulkCreateMutation.mutate(payload, {
			onSuccess: () => {
				addQAWPopoverStore.reset();
				isOpen = false;
			}
		});
	}

	$effect(() => {
		if (addQAWPopoverStore.values.length === 0) {
			addQAWPopoverStore.addEmptyRecord();
		}
	});
</script>

{#snippet wordTypeOptionLeading(option: DropdownSelectOption)}
	<span class={getWordTypeSwatchClasses(option.value)} aria-hidden="true"></span>
{/snippet}

{#snippet addWordsLayout()}
	<div class="flex items-start justify-between gap-2">
		<h2 class="text-white">{m['features.app-layouts.add-qaw-popover.title']()}</h2>

		<button
			type="button"
			aria-label={m['features.app-layouts.add-qaw-popover.close']()}
			class={cn(
				'shrink-0 -mr-0.5 -mt-0.5 rounded-md p-1',
				'text-gray-500 transition-colors',
				'hover:bg-white/5 hover:text-gray-300'
			)}
			onclick={() => {
				isOpen = false;
			}}
		>
			<X class="h-4 w-4" />
		</button>
	</div>

	<p class="text-sm text-gray-400">
		{m['features.app-layouts.add-qaw-popover.description']()}
	</p>

	{#if fillGlobalError}
		<p class="mt-2 text-sm text-red-400" role="alert">{fillGlobalError}</p>
	{/if}

	{#if saveValidationError}
		<p class="mt-2 text-sm text-red-400" role="alert">{saveValidationError}</p>
	{/if}

	<div
		bind:this={recordsScrollEl}
		class={cn(
			'gap-1 mt-2 mb-1 flex flex-col min-h-0',
			isRecordsScrollable && 'overflow-y-auto overscroll-contain pr-1'
		)}
		style:max-height={isRecordsScrollable ? `${recordsScrollMaxHeightPx}px` : undefined}
	>
		{#each addQAWPopoverStore.values as wordRecord, index (index)}
			{#if index !== 0}
				<Divider />
			{/if}

			<div class="flex flex-col gap-1 w-full">
				<div class="flex gap-1 w-full">
					<Input
						placeholder={m['features.app-layouts.add-qaw-popover.word_placeholder']()}
						class="flex-1"
						inputClass={sidebarFieldClass}
						adornmentClass={sidebarAdornmentClass}
						leftAdornment={EyeIcon}
						bind:value={wordRecord.word}
						disabled={isBusy}
						onInput={() => {
							if (wordRecord.aiError) {
								wordRecord.aiError = null;
							}
						}}
					/>

					<Input
						placeholder={m['features.app-layouts.add-qaw-popover.translation_placeholder']()}
						class="flex-1"
						inputClass={sidebarFieldClass}
						adornmentClass={sidebarAdornmentClass}
						leftAdornment={ArrowLeftRight}
						bind:value={wordRecord.translation}
						disabled={isBusy}
					/>

					<DropdownSelect
						value={wordRecord.type ?? WordTypeOptions[0].value}
						onValueChange={(type) => {
							wordRecord.type = type;
						}}
						options={WordTypeOptions}
						buttonClass={cn('w-[160px]', sidebarFieldClass)}
						dropdownClass={sidebarDropdownMenuClass}
						optionLeading={wordTypeOptionLeading}
					/>

					<IconButton
						type="OUTLINED"
						variant="DELETE"
						ariaLabel={m['features.app-layouts.add-qaw-popover.remove_record']()}
						onClick={() => addQAWPopoverStore.removeRecord(index)}
						icon={Minus}
						disabled={isBusy}
					/>
				</div>

				{#if wordRecord.aiError}
					<p class="text-xs text-red-400" role="alert">
						{getRowFillErrorMessage(wordRecord.aiError as QAWFillGapsRowErrorCode)}
					</p>
				{/if}

				<div class="flex gap-1">
					<Toggle
						bind:checked={wordRecord.isDescriptionEnabled}
						class="text-gray-200"
						spanClass={sidebarToggleSpanClass}
						disabled={isBusy}
					/>

					<AutoHeightTextarea
						formField
						LINE_HEIGHT={20}
						className={cn('min-h-[40px] flex items-center', sidebarFieldClass)}
						textAreaClassName={sidebarFieldTextClass}
						placeholder={m['features.app-layouts.add-qaw-popover.description_placeholder']()}
						disabled={!wordRecord.isDescriptionEnabled || isBusy}
						bind:value={wordRecord.definition}
					/>
				</div>
			</div>
		{/each}
	</div>

	<div class="flex w-full justify-between">
		<Button
			onClick={handleAddMore}
			type="OUTLINED"
			variant="TEXT"
			class={sidebarAddMoreButtonClass}
			disabled={addQAWPopoverStore.values.length >= ADD_QAW_POPOVER_MAX_COUNT || isBusy}
		>
			<Plus />
			<span>{m['features.app-layouts.add-qaw-popover.add_more']()}</span>
		</Button>

		<Button
			onClick={() => addQAWPopoverStore.reset()}
			type="OUTLINED"
			variant="DELETE"
			class={sidebarResetButtonClass}
			disabled={addQAWPopoverStore.values.length === 1 || isBusy}
		>
			<BinaryIcon />
			<span>{m['features.app-layouts.add-qaw-popover.reset']()}</span>
		</Button>
	</div>

	<div class="mt-2 flex flex-col gap-2">
		{#if fillGapsMutation.isPending}
			<p class="text-sm text-gray-400">{fillProgressLabel}</p>
		{/if}

		<div class="flex flex-wrap items-stretch gap-2">
			<div class="w-[256px] shrink-0">
				<AiActionButton
					status={fillButtonStatus}
					disabled={!hasWordToFill || isBusy}
					onclick={handleFillWithAi}
					labels={{
						default: m['features.app-layouts.add-qaw-popover.fill_with_ai'](),
						loading: fillProgressLabel,
						success: m['components.utils.generate-with-ai.success'](),
						failed: m['components.utils.generate-with-ai.failed']()
					}}
				/>
			</div>

			<Button class="min-w-[256px] flex-1" disabled={isBusy} onClick={handleSave}>
				{bulkCreateMutation.isPending
					? m['features.app-layouts.add-qaw-popover.saving']()
					: m['features.app-layouts.add-qaw-popover.save']()}
			</Button>
		</div>
	</div>
{/snippet}

<SidebarLink
	id={ADD_QAW_POPOVER_TRIGGER_ID}
	title={m['features.app-layouts.add-qaw-popover.title']()}
	Icon={CirclePlus}
/>

<Popover
	bind:isOpen
	triggeredBy={`#${ADD_QAW_POPOVER_TRIGGER_ID}`}
	trigger="click"
	placement="right"
	class={sidebarPopoverClass}
	middlewares={sidebarPopoverMiddlewares}
>
	{@render addWordsLayout()}
</Popover>
