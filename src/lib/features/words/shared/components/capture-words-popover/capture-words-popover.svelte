<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { fade } from 'svelte/transition';
	import { tick } from 'svelte';
	import { isAxiosError } from 'axios';
	import {
		ArrowLeftRight,
		BookOpen,
		BrushCleaning,
		CirclePlus,
		EyeIcon,
		Minus,
		Plus,
		RotateCcw,
		Save,
		Tag,
		TriangleAlert,
		Type,
		X
	} from 'lucide-svelte';
	import { Button } from '$lib/components/buttons/button';
	import { AiActionButton } from '$lib/components/buttons/ai-action-button';
	import type { AiActionButtonStatus } from '$lib/components/buttons/ai-action-button/ai-action-button.types';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { Input } from '$lib/components/forms/input';
	import { DropdownSelect } from '$lib/components/forms/dropdown-select';
	import type { DropdownSelectOption } from '$lib/components/forms/dropdown-select';
	import { AutoHeightTextarea } from '$lib/components/forms/auto-height-textarea';
	import { Loader } from '$lib/components/utils/loader';
	import { toast } from '$lib/components/utils/toast/toast';
	import { cn } from '$lib/utils/cn';
	import { getApiErrorMessage } from '$lib/utils/get-api-error-message';
	import { authStore } from '$auth/stores';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { createCreateWordsMutation, createWordFillGapsMutation } from '$words/api-client';
	import { invalidateWordCaptureQueries } from '$words/api-client/utils/invalidate-word-capture-queries';
	import {
		WORD_TYPE_OPTIONS,
		getWordTypeSwatchClasses,
		getWordTypeSwatchDotClasses
	} from '$words/shared/constants';
	import { WORD_EXTRA_MARK_OPTIONS } from '$words/shared/constants/enum-values';
	import { getWordExtraMarkIcon } from '$words/shared/constants/word-extra-mark-styles';
	import type { WordExtraMark, WordFillGapsRowErrorCode, WordType } from '$words/types';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';
	import {
		CAPTURE_WORDS_DESCRIPTION_MAX_LENGTH,
		CAPTURE_WORDS_POPOVER_MAX_COUNT
	} from './capture-words-popover.constants';
	import type { CaptureWordsSaveStatus } from './capture-words-popover.types';
	import {
		applyFillResultToRow,
		buildCreateWordsPayload,
		collectFillGapsItems,
		isRowEligibleForAiFill
	} from './capture-fill-gaps.utils';
	import { clearCaptureWordsDraftFromStorage } from './capture-words-popover.storage';
	import {
		captureWordsPopoverStore,
		isCaptureFormRowEmpty
	} from './capture-words-popover.store.svelte';
	import CaptureWordsPopoverDevtools from './capture-words-popover-devtools.svelte';
	import CaptureWordsRowFillOverlay from './capture-words-row-fill-overlay.svelte';
	import CaptureWordsSaveStatusPanel from './capture-words-save-status-panel.svelte';

	type WordTypeSelectOption = DropdownSelectOption<WordType | null>;
	type WordExtraMarkSelectOption = DropdownSelectOption<WordExtraMark | null>;

	interface Props {
		isSidebarExpanded: boolean;
	}

	let { isSidebarExpanded }: Props = $props();

	const modalWidthClass = 'w-[min(52rem,calc(100vw-2rem))]';

	const compactTypeSelectClass =
		'w-full min-w-0 xl:w-[7.5rem] xl:max-w-[7.5rem] [&_.form-input-container]:min-w-0 [&_.form-input-container_span]:truncate';

	const compactExtraMarkSelectClass =
		'w-full min-w-0 xl:w-[10rem] xl:max-w-[10rem] [&_.form-input-container]:min-w-0 [&_.form-input-container_span]:truncate';

	const queryClient = useQueryClient();
	const fillGapsMutation = createWordFillGapsMutation();
	const createWordsMutation = createCreateWordsMutation();

	let formScrollEl: HTMLDivElement | undefined = $state();
	let formResetKey = $state(0);
	let isOpen = $state(false);
	let fillButtonStatus = $state<AiActionButtonStatus>('default');
	let fillGlobalError = $state<string | null>(null);
	let saveValidationError = $state<string | null>(null);
	let saveStatus = $state<CaptureWordsSaveStatus>('idle');
	let saveError = $state<string | null>(null);
	let fillingRowIndices = $state<number[]>([]);

	const learningLanguage = $derived(authStore.user?.selectedLearningLanguage ?? undefined);

	const isSaveBusy = $derived(createWordsMutation.isPending || saveStatus === 'loading');

	const hasWordToFill = $derived(
		captureWordsPopoverStore.values.some((row) => isRowEligibleForAiFill(row))
	);

	const isBusy = $derived(isSaveBusy || fillGapsMutation.isPending);

	const isSaveErrorVisible = $derived(saveStatus === 'error');

	const isFillLoading = $derived(fillButtonStatus === 'loading');

	const fillProgressLabel = $derived.by(() => {
		const count =
			fillingRowIndices.length > 0
				? fillingRowIndices.length
				: captureWordsPopoverStore.values.filter((row) => isRowEligibleForAiFill(row)).length;

		return m['features.words.capture-popover.fill_progress']({ count });
	});

	function isRowBeingFilled(index: number): boolean {
		return isFillLoading && fillingRowIndices.includes(index);
	}

	function clearFillingRowIndices() {
		fillingRowIndices = [];
	}

	const recordCount = $derived(captureWordsPopoverStore.values.length);

	const draftWordCount = $derived(
		captureWordsPopoverStore.values.filter((row) => row.word.trim().length > 0).length
	);

	const canRemoveRecords = $derived(recordCount > 1);

	const canClearEmptyRows = $derived(
		recordCount > 1 && captureWordsPopoverStore.values.some((row) => isCaptureFormRowEmpty(row))
	);

	const typeOptions = $derived<WordTypeSelectOption[]>([
		{
			label: m['features.words.capture-popover.type_placeholder'](),
			value: null
		},
		...WORD_TYPE_OPTIONS
	]);

	const extraMarkOptions = $derived<WordExtraMarkSelectOption[]>([
		{
			label: m['features.words.capture-popover.extra_mark_placeholder'](),
			value: null
		},
		...WORD_EXTRA_MARK_OPTIONS
	]);

	function formatDraftBadgeCount(count: number): string {
		return count > 99 ? '99+' : String(count);
	}

	async function handleAddMore() {
		captureWordsPopoverStore.addEmptyRecord();
		await tick();
		formScrollEl?.scrollTo({ top: formScrollEl.scrollHeight, behavior: 'smooth' });
	}

	function getSaveValidationMessage(
		reason: 'no_words' | 'incomplete_row',
		rowIndex: number
	): string {
		if (reason === 'incomplete_row') {
			return m['features.words.capture-popover.save_incomplete_row']({ index: rowIndex + 1 });
		}

		return m['features.words.capture-popover.save_no_words']();
	}

	function getFillValidationMessage(
		reason: 'no_words' | 'all_already_filled' | 'too_many_words' | 'word_too_long'
	): string {
		switch (reason) {
			case 'no_words':
				return m['features.words.capture-popover.fill_validation.no_words']();
			case 'all_already_filled':
				return m['features.words.capture-popover.fill_validation.all_already_filled']();
			case 'word_too_long':
				return m['features.words.capture-popover.fill_validation.word_too_long']();
			case 'too_many_words':
				return m['features.words.capture-popover.fill_validation.too_many_words']();
		}
	}

	function getRowFillErrorMessage(code: string): string {
		if (code === 'NON_EXISTENT_WORD') {
			return m['features.words.capture-popover.fill_row_errors.NON_EXISTENT_WORD']();
		}
		if (code === 'AMBIGUOUS_WORD') {
			return m['features.words.capture-popover.fill_row_errors.AMBIGUOUS_WORD']();
		}

		return m['features.words.capture-popover.fill_row_errors.unknown']();
	}

	function clearPersistedDraft() {
		const userKey = authStore.user?.email;

		if (userKey) {
			clearCaptureWordsDraftFromStorage(userKey);
		}
	}

	function handleFillWithAi() {
		saveValidationError = null;
		fillGlobalError = null;
		captureWordsPopoverStore.removeEmptyRecords();

		const collected = collectFillGapsItems(captureWordsPopoverStore.values);
		if (!collected.ok) {
			const message = getFillValidationMessage(collected.reason);
			fillGlobalError = message;
			fillButtonStatus = 'failed';
			toast.error(message);

			return;
		}

		if (!learningLanguage) {
			const message = m['features.words.capture-popover.save_no_language']();
			fillGlobalError = message;
			fillButtonStatus = 'failed';
			toast.error(message);

			return;
		}

		for (const rowIndex of collected.rowIndices) {
			captureWordsPopoverStore.values[rowIndex].aiError = null;
		}

		fillingRowIndices = collected.rowIndices;
		fillButtonStatus = 'loading';

		const aiToast = toast.aiProgress(
			m['components.utils.toast.ai_thinking_1'](),
			m['components.utils.toast.title_ai_pending']()
		);

		fillGapsMutation.mutate(
			{ language: learningLanguage, items: collected.items },
			{
				onSuccess: (response) => {
					const items = response.items ?? [];
					let rowErrorCount = 0;

					for (let i = 0; i < items.length; i++) {
						const rowIndex = collected.rowIndices[i];
						applyFillResultToRow(captureWordsPopoverStore.values[rowIndex], items[i]);

						if (captureWordsPopoverStore.values[rowIndex].aiError) {
							rowErrorCount += 1;
						}
					}

					fillButtonStatus = 'success';

					if (rowErrorCount === items.length) {
						aiToast.error(
							m['features.words.capture-popover.toast.fill_all_rows_error']({
								count: items.length
							})
						);

						return;
					}

					if (rowErrorCount > 0) {
						aiToast.success(
							m['features.words.capture-popover.toast.fill_partial_success']({
								filled: items.length - rowErrorCount,
								total: items.length
							})
						);

						return;
					}

					aiToast.success(
						m['features.words.capture-popover.toast.fill_success']({ count: items.length })
					);
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
						fillGlobalError = message ?? m['features.words.capture-popover.fill_global_error']();
						aiToast.error(
							getApiErrorMessage(error, m['features.words.capture-popover.toast.fill_error']())
						);

						return;
					}

					fillGlobalError = m['features.words.capture-popover.fill_global_error']();
					aiToast.error(
						getApiErrorMessage(error, m['features.words.capture-popover.toast.fill_error']())
					);
				},
				onSettled: () => {
					clearFillingRowIndices();
				}
			}
		);
	}

	function getSaveErrorMessage(error: unknown): string {
		if (isAxiosError(error) && error.response?.status === 400) {
			const message =
				typeof error.response.data === 'object' &&
				error.response.data !== null &&
				'message' in error.response.data &&
				typeof error.response.data.message === 'string'
					? error.response.data.message
					: null;

			if (message) {
				return message;
			}
		}

		return m['features.words.capture-popover.save_error.description']();
	}

	function resetSaveState() {
		saveStatus = 'idle';
		saveError = null;
	}

	function closeModal() {
		if (saveStatus === 'loading') {
			return;
		}

		isOpen = false;
	}

	function handleOpenChange(open: boolean) {
		if (open) {
			isOpen = true;

			return;
		}

		closeModal();
	}

	function handleSaveBackToForm() {
		resetSaveState();
	}

	function resetForm() {
		captureWordsPopoverStore.reset();
		formResetKey += 1;
		clearFillingRowIndices();
		clearPersistedDraft();
	}

	function completeSaveSuccess(savedCount: number) {
		resetForm();
		fillButtonStatus = 'default';
		fillGlobalError = null;
		saveValidationError = null;
		resetSaveState();
		invalidateWordCaptureQueries(queryClient);
		toast.success(m['features.words.capture-popover.toast.save_success']({ count: savedCount }));
		isOpen = false;
	}

	function seedSampleWordsForDevtools() {
		if (captureWordsPopoverStore.values.length === 0) {
			captureWordsPopoverStore.addEmptyRecord();
		}

		captureWordsPopoverStore.values[0].word = 'hello';
		captureWordsPopoverStore.values[0].translation = '';

		if (captureWordsPopoverStore.values.length < 2) {
			captureWordsPopoverStore.addEmptyRecord();
		}

		captureWordsPopoverStore.values[1].word = 'run';
		captureWordsPopoverStore.values[1].translation = '';
	}

	function applyMockFillSuccessForDevtools() {
		captureWordsPopoverStore.clearAiErrors();
		fillGlobalError = null;

		for (const row of captureWordsPopoverStore.values) {
			const sourceWord = row.word.trim();
			if (!sourceWord) continue;

			applyFillResultToRow(row, {
				inputSourceWord: sourceWord,
				sourceWord: sourceWord,
				translation: `translation of ${sourceWord}`,
				definition: `Sample definition for ${sourceWord}.`,
				type: 'NOUN',
				extraMark: null,
				error: null
			});
		}

		fillButtonStatus = 'success';
	}

	function applyMockFillRowErrorsForDevtools() {
		fillGlobalError = null;

		for (const row of captureWordsPopoverStore.values) {
			if (!row.word.trim()) continue;

			applyFillResultToRow(row, {
				inputSourceWord: row.word.trim(),
				sourceWord: null,
				translation: null,
				definition: null,
				type: null,
				extraMark: null,
				error: 'NON_EXISTENT_WORD'
			});
		}

		fillButtonStatus = 'success';
	}

	function handleReset() {
		resetForm();
		fillButtonStatus = 'default';
		fillGlobalError = null;
		saveValidationError = null;
	}

	function handleSave() {
		fillGlobalError = null;
		saveValidationError = null;
		saveError = null;

		if (!learningLanguage) {
			const message = m['features.words.capture-popover.save_no_language']();
			saveValidationError = message;
			toast.error(message);

			return;
		}

		const collected = buildCreateWordsPayload(captureWordsPopoverStore.values, learningLanguage);
		if (!collected.ok) {
			const message = getSaveValidationMessage(collected.reason, collected.rowIndex);
			saveValidationError = message;
			toast.error(message);

			return;
		}

		saveStatus = 'loading';

		createWordsMutation.mutate(collected.payload, {
			onSuccess: () => {
				completeSaveSuccess(collected.payload.length);
			},
			onError: (error) => {
				saveStatus = 'error';
				saveError = getSaveErrorMessage(error);
				toast.error(getApiErrorMessage(error, m['features.words.capture-popover.toast.save_error']()));
			}
		});
	}

	let hydratedForUser = $state<string | null>(null);

	$effect(() => {
		const userKey = authStore.user?.email ?? null;

		if (userKey !== hydratedForUser) {
			hydratedForUser = userKey;
			captureWordsPopoverStore.hydrateFromStorage(userKey);
		}
	});

	$effect(() => {
		const userKey = authStore.user?.email ?? null;
		if (!userKey) return;

		for (const row of captureWordsPopoverStore.values) {
			void row.isDescriptionEnabled;
			void row.word;
			void row.translation;
			void row.type;
			void row.extraMark;
			void row.definition;
			void row.isAiGenerated;
		}

		captureWordsPopoverStore.persistDraft(userKey);
	});

	$effect(() => {
		if (!isOpen) {
			resetSaveState();
			fillButtonStatus = 'default';
			fillGlobalError = null;
			saveValidationError = null;
			clearFillingRowIndices();
		}
	});

	$effect(() => {
		if (captureWordsPopoverStore.values.length === 0) {
			captureWordsPopoverStore.addEmptyRecord();
		}
	});
</script>

{#snippet wordTypeTriggerIcon({ selectedOption }: { selectedOption: WordTypeSelectOption })}
	{#if selectedOption.value}
		<span class={getWordTypeSwatchClasses(selectedOption.value)} aria-hidden="true">
			<span class={getWordTypeSwatchDotClasses(selectedOption.value)}></span>
		</span>
	{:else}
		<Type class="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
	{/if}
{/snippet}

{#snippet wordTypeOptionLeading(option: WordTypeSelectOption)}
	{#if option.value}
		<span class={getWordTypeSwatchClasses(option.value)} aria-hidden="true">
			<span class={getWordTypeSwatchDotClasses(option.value)}></span>
		</span>
	{/if}
{/snippet}

{#snippet extraMarkTriggerIcon({ selectedOption }: { selectedOption: WordExtraMarkSelectOption })}
	{#if selectedOption.value}
		{@const Icon = getWordExtraMarkIcon(selectedOption.value)}
		<Icon class="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
	{:else}
		<Tag class="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
	{/if}
{/snippet}

{#snippet extraMarkOptionLeading(option: WordExtraMarkSelectOption)}
	{#if option.value}
		{@const Icon = getWordExtraMarkIcon(option.value)}
		<Icon class="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
	{/if}
{/snippet}

<button
	type="button"
	data-testid={E2E_TEST_IDS.capturePopover.trigger}
	title={m['features.words.capture-popover.title']()}
	class={cn(
		'flex w-full items-center py-2 transition-colors rounded-lg',
		'cursor-pointer text-ink hover:bg-accent-soft hover:text-ink',
		isSidebarExpanded ? 'gap-3 px-3 justify-start' : 'justify-center px-0'
	)}
	onclick={() => {
		isOpen = true;
	}}
>
	<span class="relative inline-flex shrink-0">
		<CirclePlus class="h-5 w-5" />
		{#if draftWordCount > 0}
			<span
				data-testid={E2E_TEST_IDS.capturePopover.draftBadge}
				class="absolute -right-1.5 -top-1.5 flex min-w-4 items-center justify-center rounded-full bg-ink px-1 py-0.5 text-[10px] font-semibold leading-none text-canvas tabular-nums"
				aria-hidden="true"
			>
				{formatDraftBadgeCount(draftWordCount)}
			</span>
		{/if}
	</span>
	{#if isSidebarExpanded}
		<span class="text-sm font-medium" in:fade={{ delay: 150 }}>
			{m['features.words.capture-popover.title']()}
		</span>
	{/if}
</button>

<Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm" />
		<Dialog.Content
			data-testid={E2E_TEST_IDS.capturePopover.root}
			class={cn(
				'overlay-surface fixed top-1/2 left-1/2 z-50 flex max-h-[min(90dvh,calc(100vh-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden',
				modalWidthClass,
				'border border-line shadow-lg'
			)}
			onInteractOutside={(event) => {
				if (!(event.target instanceof HTMLElement)) return;

				if (event.target.closest('[data-capture-devtools]')) {
					event.preventDefault();
				}
			}}
		>
			<header class="shrink-0 border-b border-line px-5 pb-4 pt-5">
				<div
					class={cn('flex items-start gap-3', isSaveErrorVisible ? 'justify-end' : 'justify-between')}
				>
					{#if !isSaveErrorVisible}
						<div class="flex min-w-0 flex-1 items-start gap-3">
							<div
								class="flex size-[54px] shrink-0 items-center justify-center rounded-[10px] bg-primary-50 text-primary-600 dark:bg-primary-900/25 dark:text-primary-400"
								aria-hidden="true"
							>
								<BookOpen class="size-6" />
							</div>

							<div class="min-w-0 flex-1">
								<Dialog.Title class="text-lg font-semibold text-ink">
									{m['features.words.capture-popover.title']()}
								</Dialog.Title>
								<Dialog.Description class="mt-1 text-sm leading-relaxed text-ink-muted">
									{m['features.words.capture-popover.description']()}
								</Dialog.Description>
							</div>
						</div>
					{:else}
						<Dialog.Title class="sr-only">
							{m['features.words.capture-popover.title']()}
						</Dialog.Title>
					{/if}

					<button
						type="button"
						aria-label={m['features.words.capture-popover.close']()}
						class={cn(
							'shrink-0 rounded-lg p-1.5 text-ink-subtle transition-colors',
							'hover:bg-accent-soft hover:text-ink',
							saveStatus === 'loading' && 'cursor-not-allowed opacity-50'
						)}
						disabled={saveStatus === 'loading'}
						onclick={closeModal}
					>
						<X class="size-4" />
					</button>
				</div>

				{#if !isSaveErrorVisible && (fillGlobalError || saveValidationError)}
					<div class="mt-3 space-y-2">
						{#if fillGlobalError}
							<p
								class="rounded-[10px] border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger"
								role="alert"
							>
								{fillGlobalError}
							</p>
						{/if}

						{#if saveValidationError}
							<p
								class="rounded-[10px] border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger"
								role="alert"
							>
								{saveValidationError}
							</p>
						{/if}
					</div>
				{/if}
			</header>

			<div bind:this={formScrollEl} class="relative min-h-0 flex-1 overflow-y-auto px-5 py-4">
				{#if isSaveErrorVisible}
					<div data-testid={E2E_TEST_IDS.capturePopover.saveStatusError}>
						<CaptureWordsSaveStatusPanel
							variant="error"
							header={m['features.words.capture-popover.save_error.header']()}
							description={saveError ?? m['features.words.capture-popover.save_error.description']()}
							primaryButton={{
								label: m['features.words.capture-popover.save_error.try_again'](),
								onClick: handleSave
							}}
							secondaryButton={{
								label: m['features.words.capture-popover.save_error.back_to_form'](),
								onClick: handleSaveBackToForm
							}}
						/>
					</div>
				{:else}
					<div
						class={cn(
							'flex min-h-0 flex-col gap-3',
							saveStatus === 'loading' && 'pointer-events-none opacity-50'
						)}
					>
						{#each captureWordsPopoverStore.values as wordRecord, index (`${formResetKey}-${index}`)}
							<article
								class={cn(
									'relative rounded-xl border p-3',
									wordRecord.aiError ? 'border-danger/25 bg-danger/5' : 'border-line bg-accent-soft/30'
								)}
								aria-label={m['features.words.capture-popover.row_label']({ index: index + 1 })}
							>
								{#if wordRecord.aiError}
									<div class="mb-2 flex items-start gap-2" role="alert">
										<TriangleAlert class="mt-0.5 size-4 shrink-0 text-danger" aria-hidden="true" />
										<h3 class="text-sm font-medium leading-snug text-danger">
											{getRowFillErrorMessage(wordRecord.aiError as WordFillGapsRowErrorCode)}
										</h3>
									</div>
								{/if}

								<div class="flex gap-2">
									<div
										class="grid min-w-0 flex-1 gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_7.5rem_10rem]"
									>
										<Input
											placeholder={m['features.words.capture-popover.word_placeholder']()}
											class="min-w-0"
											leftAdornment={EyeIcon}
											bind:value={wordRecord.word}
											disabled={isSaveBusy || isRowBeingFilled(index)}
											onInput={() => {
												if (wordRecord.aiError) {
													wordRecord.aiError = null;
												}

												if (wordRecord.isAiGenerated) {
													wordRecord.isAiGenerated = false;
												}
											}}
										/>

										<Input
											placeholder={m['features.words.capture-popover.translation_placeholder']()}
											class="min-w-0"
											leftAdornment={ArrowLeftRight}
											bind:value={wordRecord.translation}
											disabled={isSaveBusy || isRowBeingFilled(index)}
										/>

										<DropdownSelect
											value={wordRecord.type}
											onValueChange={(type) => {
												wordRecord.type = type;
											}}
											options={typeOptions}
											buttonClass={compactTypeSelectClass}
											icon={wordTypeTriggerIcon}
											optionLeading={wordTypeOptionLeading}
										/>

										<DropdownSelect
											value={wordRecord.extraMark ?? null}
											onValueChange={(mark) => {
												wordRecord.extraMark = mark ?? undefined;
											}}
											options={extraMarkOptions}
											buttonClass={compactExtraMarkSelectClass}
											ariaLabel={m['features.words.capture-popover.extra_mark_aria']()}
											icon={extraMarkTriggerIcon}
											optionLeading={extraMarkOptionLeading}
										/>
									</div>

									{#if canRemoveRecords}
										<IconButton
											type="OUTLINED"
											variant="TEXT"
											class="!size-10 shrink-0 self-start"
											ariaLabel={m['features.words.capture-popover.remove_record']()}
											onClick={() => captureWordsPopoverStore.removeRecord(index)}
											icon={Minus}
											disabled={isSaveBusy || isRowBeingFilled(index)}
										/>
									{/if}
								</div>

								<div class="mt-2">
									<AutoHeightTextarea
										formField
										LINE_HEIGHT={20}
										maxLength={CAPTURE_WORDS_DESCRIPTION_MAX_LENGTH}
										className="w-full"
										placeholder={m['features.words.capture-popover.description_placeholder']()}
										disabled={isSaveBusy || isRowBeingFilled(index)}
										bind:value={wordRecord.definition}
									/>
								</div>

								{#if isRowBeingFilled(index)}
									<CaptureWordsRowFillOverlay ariaLabel={fillProgressLabel} />
								{/if}
							</article>
						{/each}
					</div>

					<div class="mt-3 flex flex-wrap items-center gap-2">
						<Button
							onClick={handleAddMore}
							type="OUTLINED"
							variant="TEXT"
							disabled={recordCount >= CAPTURE_WORDS_POPOVER_MAX_COUNT || isBusy}
						>
							<Plus class="size-4" />
							<span>{m['features.words.capture-popover.add_more']()}</span>
						</Button>

						<IconButton
							type="OUTLINED"
							variant="TEXT"
							icon={BrushCleaning}
							dataTestId={E2E_TEST_IDS.capturePopover.clearEmpty}
							ariaLabel={m['features.words.capture-popover.clear_empty']()}
							tooltip={m['features.words.capture-popover.clear_empty']()}
							disabled={!canClearEmptyRows || isBusy}
							onClick={() => captureWordsPopoverStore.removeEmptyRecords()}
						/>

						<AiActionButton
							class="ml-auto h-10 w-full min-w-0 sm:w-auto sm:min-w-40"
							status={fillButtonStatus}
							disabled={!hasWordToFill || isBusy}
							onclick={handleFillWithAi}
							labels={{
								default: m['features.words.capture-popover.fill_with_ai'](),
								loading: fillProgressLabel,
								success: m['components.utils.generate-with-ai.success'](),
								failed: m['components.utils.generate-with-ai.failed']()
							}}
						/>
					</div>

					{#if saveStatus === 'loading'}
						<div
							data-testid={E2E_TEST_IDS.capturePopover.saveStatusLoading}
							class="absolute inset-0 flex items-center justify-center bg-canvas/60 backdrop-blur-[1px]"
							aria-busy="true"
							aria-live="polite"
						>
							<Loader wrapperClass="py-4" />
						</div>
					{/if}
				{/if}
			</div>

			{#if !isSaveErrorVisible}
				<footer class="shrink-0 border-t border-line bg-surface/80 px-5 py-3">
					<div class="flex flex-wrap items-center justify-end gap-2">
						<Button type="OUTLINED" variant="TEXT" disabled={isBusy} onClick={handleReset}>
							<RotateCcw class="size-4" aria-hidden="true" />
							{m['features.words.capture-popover.reset']()}
						</Button>

						<Button
							type="OUTLINED"
							variant="TEXT"
							disabled={saveStatus === 'loading'}
							onClick={closeModal}
						>
							<X class="size-4" aria-hidden="true" />
							{m['features.words.capture-popover.close']()}
						</Button>

						<Button
							type="FILLED"
							variant="PRIMARY"
							class="min-w-24"
							disabled={isBusy}
							onClick={handleSave}
						>
							<Save class="size-4" aria-hidden="true" />
							{saveStatus === 'loading'
								? m['features.words.capture-popover.saving']()
								: m['features.words.capture-popover.save']()}
						</Button>
					</div>
				</footer>
			{/if}
		</Dialog.Content>

		{#if isOpen}
			<CaptureWordsPopoverDevtools
				{fillButtonStatus}
				onFillButtonStatusChange={(status) => {
					fillButtonStatus = status;
				}}
				onSeedSampleWords={seedSampleWordsForDevtools}
				onApplyMockFillSuccess={applyMockFillSuccessForDevtools}
				onApplyMockFillRowErrors={applyMockFillRowErrorsForDevtools}
				onSetFillGlobalError={(message) => {
					fillGlobalError = message;
				}}
				onResetForm={handleReset}
			/>
		{/if}
	</Dialog.Portal>
</Dialog.Root>
