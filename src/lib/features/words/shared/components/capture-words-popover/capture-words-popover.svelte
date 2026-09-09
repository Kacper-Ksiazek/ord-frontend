<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { fade } from 'svelte/transition';
	import { tick } from 'svelte';
	import { isAxiosError } from 'axios';
	import {
		ArrowLeftRight,
		BrushCleaning,
		CirclePlus,
		EyeIcon,
		Minus,
		Plus,
		RotateCcw,
		Save,
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
	import { cn } from '$lib/utils/cn';
	import { authStore } from '$auth/stores';
	import { createCaptureWordsMutation, createWordFillGapsMutation } from '$words/api-client';
	import {
		WORD_TYPE_OPTIONS,
		getWordTypeSwatchClasses,
		getWordTypeSwatchDotClasses
	} from '$words/shared/constants';
	import type { WordFillGapsRowErrorCode, WordType } from '$words/types';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';
	import {
		CAPTURE_WORDS_DESCRIPTION_MAX_LENGTH,
		CAPTURE_WORDS_POPOVER_MAX_COUNT
	} from './capture-words-popover.constants';
	import type { CaptureWordsSaveStatus } from './capture-words-popover.types';
	import {
		applyFillResultToRow,
		buildBulkCreatePayload,
		collectFillGapsItems
	} from './capture-fill-gaps.utils';
	import {
		captureWordsPopoverStore,
		isCaptureFormRowEmpty
	} from './capture-words-popover.store.svelte';
	import CaptureWordsSaveStatusPanel from './capture-words-save-status-panel.svelte';

	type WordTypeSelectOption = DropdownSelectOption<WordType | null>;

	interface Props {
		isSidebarExpanded: boolean;
	}

	let { isSidebarExpanded }: Props = $props();

	const modalWidthClass = 'w-[min(42rem,calc(100vw-2rem))]';

	const fillGapsMutation = createWordFillGapsMutation();
	const bulkCreateMutation = createCaptureWordsMutation();

	let formScrollEl: HTMLDivElement | undefined = $state();
	let isOpen = $state(false);
	let fillButtonStatus = $state<AiActionButtonStatus>('default');
	let fillGlobalError = $state<string | null>(null);
	let saveValidationError = $state<string | null>(null);
	let saveStatus = $state<CaptureWordsSaveStatus>('idle');
	let saveError = $state<string | null>(null);

	const learningLanguage = $derived(authStore.user?.selectedLearningLanguage ?? undefined);

	const hasWordToFill = $derived(
		captureWordsPopoverStore.values.some((row) => row.word.trim().length > 0)
	);

	const isBusy = $derived(
		fillGapsMutation.isPending || bulkCreateMutation.isPending || saveStatus === 'loading'
	);

	const isSaveResultVisible = $derived(saveStatus === 'success' || saveStatus === 'error');

	const fillProgressLabel = $derived.by(() => {
		const count = captureWordsPopoverStore.values.filter((row) => row.word.trim()).length;

		return m['features.words.capture-popover.fill_progress']({ count });
	});

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

	function formatDraftBadgeCount(count: number): string {
		return count > 99 ? '99+' : String(count);
	}

	async function handleAddMore() {
		captureWordsPopoverStore.addEmptyRecord();
		await tick();
		formScrollEl?.scrollTo({ top: formScrollEl.scrollHeight, behavior: 'smooth' });
	}

	function getFillValidationMessage(
		reason: 'no_words' | 'too_many_words' | 'word_too_long'
	): string {
		switch (reason) {
			case 'no_words':
				return m['features.words.capture-popover.fill_validation.no_words']();
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

	function handleFillWithAi() {
		saveValidationError = null;
		fillGlobalError = null;

		const collected = collectFillGapsItems(captureWordsPopoverStore.values);
		if (!collected.ok) {
			fillGlobalError = getFillValidationMessage(collected.reason);
			fillButtonStatus = 'failed';

			return;
		}

		if (!learningLanguage) {
			fillGlobalError = m['features.words.capture-popover.save_no_language']();
			fillButtonStatus = 'failed';

			return;
		}

		captureWordsPopoverStore.clearAiErrors();
		fillButtonStatus = 'loading';

		fillGapsMutation.mutate(
			{ language: learningLanguage, items: collected.items },
			{
				onSuccess: (response) => {
					const items = response.items ?? [];
					for (let i = 0; i < items.length; i++) {
						const rowIndex = collected.rowIndices[i];
						applyFillResultToRow(captureWordsPopoverStore.values[rowIndex], items[i]);
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
						fillGlobalError = message ?? m['features.words.capture-popover.fill_global_error']();

						return;
					}
					fillGlobalError = m['features.words.capture-popover.fill_global_error']();
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

	function handleSaveDone() {
		resetSaveState();
		isOpen = false;
	}

	function handleSaveBackToForm() {
		resetSaveState();
	}

	function handleReset() {
		captureWordsPopoverStore.reset();
		fillButtonStatus = 'default';
		fillGlobalError = null;
		saveValidationError = null;
	}

	function handleSave() {
		fillGlobalError = null;
		saveValidationError = null;
		saveError = null;

		if (!learningLanguage) {
			saveValidationError = m['features.words.capture-popover.save_no_language']();

			return;
		}

		const payload = buildBulkCreatePayload(captureWordsPopoverStore.values, learningLanguage);
		if (payload.length === 0) {
			saveValidationError = m['features.words.capture-popover.save_no_words']();

			return;
		}

		saveStatus = 'loading';

		bulkCreateMutation.mutate(payload, {
			onSuccess: () => {
				captureWordsPopoverStore.reset();
				fillButtonStatus = 'default';
				saveStatus = 'success';
			},
			onError: (error) => {
				saveStatus = 'error';
				saveError = getSaveErrorMessage(error);
			}
		});
	}

	$effect(() => {
		if (!isOpen) {
			resetSaveState();
			fillButtonStatus = 'default';
			fillGlobalError = null;
			saveValidationError = null;
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
		>
			<header class="shrink-0 border-b border-line px-5 pb-4 pt-5">
				<div
					class={cn('flex items-start gap-3', isSaveResultVisible ? 'justify-end' : 'justify-between')}
				>
					{#if !isSaveResultVisible}
						<div class="min-w-0 flex-1">
							<Dialog.Title class="text-lg font-semibold text-ink">
								{m['features.words.capture-popover.title']()}
							</Dialog.Title>
							<Dialog.Description class="mt-1 text-sm leading-relaxed text-ink-muted">
								{m['features.words.capture-popover.description']()}
							</Dialog.Description>
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

				{#if !isSaveResultVisible && (fillGlobalError || saveValidationError)}
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
				{#if isSaveResultVisible}
					{#if saveStatus === 'success'}
						<div data-testid={E2E_TEST_IDS.capturePopover.saveStatusSuccess}>
							<CaptureWordsSaveStatusPanel
								variant="success"
								header={m['features.words.capture-popover.save_success.header']()}
								description={m['features.words.capture-popover.save_success.description']()}
								primaryButton={{
									label: m['features.words.capture-popover.save_success.done'](),
									onClick: handleSaveDone
								}}
							/>
						</div>
					{:else}
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
					{/if}
				{:else}
					<div
						class={cn(
							'flex min-h-0 flex-col gap-3',
							saveStatus === 'loading' && 'pointer-events-none opacity-50'
						)}
					>
						{#each captureWordsPopoverStore.values as wordRecord, index (index)}
							<article
								class="rounded-xl border border-line bg-accent-soft/30 p-3"
								aria-label={m['features.words.capture-popover.row_label']({ index: index + 1 })}
							>
								<div class="flex gap-2">
									<div class="grid min-w-0 flex-1 gap-2 sm:grid-cols-3">
										<Input
											placeholder={m['features.words.capture-popover.word_placeholder']()}
											class="min-w-0"
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
											placeholder={m['features.words.capture-popover.translation_placeholder']()}
											class="min-w-0"
											leftAdornment={ArrowLeftRight}
											bind:value={wordRecord.translation}
											disabled={isBusy}
										/>

										<DropdownSelect
											value={wordRecord.type}
											onValueChange={(type) => {
												wordRecord.type = type;
											}}
											options={typeOptions}
											buttonClass="w-full min-w-0"
											icon={wordTypeTriggerIcon}
											optionLeading={wordTypeOptionLeading}
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
											disabled={isBusy}
										/>
									{/if}
								</div>

								{#if wordRecord.aiError}
									<p class="mt-2 text-xs text-danger" role="alert">
										{getRowFillErrorMessage(wordRecord.aiError as WordFillGapsRowErrorCode)}
									</p>
								{/if}

								<div class="mt-2">
									<AutoHeightTextarea
										formField
										LINE_HEIGHT={20}
										maxLength={CAPTURE_WORDS_DESCRIPTION_MAX_LENGTH}
										className="w-full"
										placeholder={m['features.words.capture-popover.description_placeholder']()}
										disabled={isBusy}
										bind:value={wordRecord.definition}
									/>
								</div>
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

			{#if !isSaveResultVisible}
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
	</Dialog.Portal>
</Dialog.Root>
