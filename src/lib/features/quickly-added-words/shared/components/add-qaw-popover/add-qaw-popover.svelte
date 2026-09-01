<script lang="ts">
	import { Popover, Switch } from 'bits-ui';
	import { fade } from 'svelte/transition';
	import { tick } from 'svelte';
	import { isAxiosError } from 'axios';
	import { ArrowLeftRight, CirclePlus, EyeIcon, Minus, Plus, RotateCcw, X } from 'lucide-svelte';
	import { Button } from '$lib/components/buttons/button';
	import { AiActionButton } from '$lib/components/buttons/ai-action-button';
	import type { AiActionButtonStatus } from '$lib/components/buttons/ai-action-button/ai-action-button.types';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { Input } from '$lib/components/forms/input';
	import { DropdownSelect } from '$lib/components/forms/dropdown-select';
	import type { DropdownSelectOption } from '$lib/components/forms/dropdown-select';
	import { AutoHeightTextarea } from '$lib/components/forms/auto-height-textarea';
	import { Divider } from '$lib/components/utils/divider';
	import { Loader } from '$lib/components/utils/loader';
	import { cn } from '$lib/utils/cn';
	import { authStore } from '$auth/stores';
	import {
		createBulkCreateQawMutation,
		createQawFillGapsMutation
	} from '$quicklyAddedWords/api-client';
	import {
		WORD_TYPE_OPTIONS,
		getWordTypeSwatchClasses,
		getWordTypeSwatchDotClasses
	} from '$quicklyAddedWords/shared/constants';
	import type { WordFillGapsRowErrorCode, WordType } from '$quicklyAddedWords/types';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$quicklyAddedWords/testing/test-ids';
	import {
		ADD_QAW_POPOVER_MAX_COUNT,
		ADD_QAW_POPOVER_ROW_HEIGHT_PX,
		ADD_QAW_POPOVER_SCROLL_FROM_COUNT
	} from './add-qaw-popover.constants';
	import type { AddQawSaveStatus } from './add-qaw-popover.types';
	import {
		applyFillResultToRow,
		buildBulkCreatePayload,
		collectFillGapsItems
	} from './add-qaw-fill-gaps.utils';
	import { addQAWPopoverStore } from './add-qaw-popover.store.svelte';
	import AddQawSaveStatusPanel from './add-qaw-save-status-panel.svelte';

	type WordTypeSelectOption = DropdownSelectOption<WordType | null>;

	interface Props {
		isSidebarExpanded: boolean;
	}

	let { isSidebarExpanded }: Props = $props();

	const popoverWidthClass = $derived(
		isSidebarExpanded ? 'w-[min(42rem,calc(100dvw-18rem))]' : 'w-[min(42rem,calc(100dvw-8rem))]'
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
	let saveStatus = $state<AddQawSaveStatus>('idle');
	let saveError = $state<string | null>(null);

	const learningLanguage = $derived(authStore.user?.selectedLearningLanguage ?? undefined);

	const isRecordsScrollable = $derived(
		addQAWPopoverStore.values.length >= ADD_QAW_POPOVER_SCROLL_FROM_COUNT
	);

	const hasWordToFill = $derived(
		addQAWPopoverStore.values.some((row) => row.word.trim().length > 0)
	);

	const isBusy = $derived(
		fillGapsMutation.isPending || bulkCreateMutation.isPending || saveStatus === 'loading'
	);

	const isSaveResultVisible = $derived(saveStatus === 'success' || saveStatus === 'error');

	const fillProgressLabel = $derived.by(() => {
		const count = addQAWPopoverStore.values.filter((row) => row.word.trim()).length;

		return m['features.quickly-added-words.add-popover.fill_progress']({ count });
	});

	const typeOptions = $derived<WordTypeSelectOption[]>([
		{
			label: m['features.quickly-added-words.add-popover.type_placeholder'](),
			value: null
		},
		...WORD_TYPE_OPTIONS
	]);

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
				return m['features.quickly-added-words.add-popover.fill_validation.no_words']();
			case 'word_too_long':
				return m['features.quickly-added-words.add-popover.fill_validation.word_too_long']();
			case 'too_many_words':
				return m['features.quickly-added-words.add-popover.fill_validation.too_many_words']();
		}
	}

	function getRowFillErrorMessage(code: string): string {
		if (code === 'NON_EXISTENT_WORD') {
			return m['features.quickly-added-words.add-popover.fill_row_errors.NON_EXISTENT_WORD']();
		}
		if (code === 'AMBIGUOUS_WORD') {
			return m['features.quickly-added-words.add-popover.fill_row_errors.AMBIGUOUS_WORD']();
		}

		return m['features.quickly-added-words.add-popover.fill_row_errors.unknown']();
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
			fillGlobalError = m['features.quickly-added-words.add-popover.save_no_language']();
			fillButtonStatus = 'failed';

			return;
		}

		addQAWPopoverStore.clearAiErrors();
		fillButtonStatus = 'loading';

		fillGapsMutation.mutate(
			{ language: learningLanguage, items: collected.items },
			{
				onSuccess: (response) => {
					const items = response.items ?? [];
					for (let i = 0; i < items.length; i++) {
						const rowIndex = collected.rowIndices[i];
						applyFillResultToRow(addQAWPopoverStore.values[rowIndex], items[i]);
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
						fillGlobalError =
							message ?? m['features.quickly-added-words.add-popover.fill_global_error']();

						return;
					}
					fillGlobalError = m['features.quickly-added-words.add-popover.fill_global_error']();
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

		return m['features.quickly-added-words.add-popover.save_error.description']();
	}

	function resetSaveState() {
		saveStatus = 'idle';
		saveError = null;
	}

	function closePopover() {
		if (saveStatus === 'loading') {
			return;
		}

		isOpen = false;
	}

	function handleSaveDone() {
		resetSaveState();
		isOpen = false;
	}

	function handleSaveBackToForm() {
		resetSaveState();
	}

	function handleSave() {
		fillGlobalError = null;
		saveValidationError = null;
		saveError = null;

		if (!learningLanguage) {
			saveValidationError = m['features.quickly-added-words.add-popover.save_no_language']();

			return;
		}

		const payload = buildBulkCreatePayload(addQAWPopoverStore.values, learningLanguage);
		if (payload.length === 0) {
			saveValidationError = m['features.quickly-added-words.add-popover.save_no_words']();

			return;
		}

		saveStatus = 'loading';

		bulkCreateMutation.mutate(payload, {
			onSuccess: () => {
				addQAWPopoverStore.reset();
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
		if (addQAWPopoverStore.values.length === 0) {
			addQAWPopoverStore.addEmptyRecord();
		}
	});
</script>

{#snippet wordTypeOptionLeading(option: WordTypeSelectOption)}
	{#if option.value}
		<span class={getWordTypeSwatchClasses(option.value)} aria-hidden="true">
			<span class={getWordTypeSwatchDotClasses(option.value)}></span>
		</span>
	{/if}
{/snippet}

<Popover.Root bind:open={isOpen}>
	<Popover.Trigger
		data-testid={E2E_TEST_IDS.popover.trigger}
		title={m['features.quickly-added-words.add-popover.title']()}
		class={cn(
			'flex w-full items-center py-2 transition-colors rounded-lg',
			'cursor-pointer text-ink hover:bg-accent-soft hover:text-ink',
			isSidebarExpanded ? 'gap-3 px-3 justify-start' : 'justify-center px-0'
		)}
	>
		<CirclePlus class="h-5 w-5 shrink-0" />
		{#if isSidebarExpanded}
			<span class="text-sm font-medium" in:fade={{ delay: 150 }}>
				{m['features.quickly-added-words.add-popover.title']()}
			</span>
		{/if}
	</Popover.Trigger>

	<Popover.Portal>
		{#if isOpen}
			<div class="fixed inset-0 z-50 bg-ink/30" aria-hidden="true" onclick={closePopover}></div>
		{/if}
		<Popover.Content
			data-testid={E2E_TEST_IDS.popover.root}
			side="right"
			sideOffset={12}
			collisionPadding={24}
			class={cn('overlay-surface z-50 p-3', popoverWidthClass, 'border-ink/25 shadow-lg')}
		>
			<div
				class={cn('flex items-start gap-2', isSaveResultVisible ? 'justify-end' : 'justify-between')}
			>
				{#if !isSaveResultVisible}
					<h2 class="text-base font-semibold text-ink">
						{m['features.quickly-added-words.add-popover.title']()}
					</h2>
				{/if}

				<button
					type="button"
					aria-label={m['features.quickly-added-words.add-popover.close']()}
					class={cn(
						'shrink-0 -mr-0.5 -mt-0.5 rounded-md p-1',
						'text-ink-subtle transition-colors',
						'hover:bg-accent-soft hover:text-ink',
						saveStatus === 'loading' && 'cursor-not-allowed opacity-50'
					)}
					disabled={saveStatus === 'loading'}
					onclick={closePopover}
				>
					<X class="h-4 w-4" />
				</button>
			</div>

			{#if !isSaveResultVisible}
				<p class="text-sm text-ink-muted">
					{m['features.quickly-added-words.add-popover.description']()}
				</p>

				{#if fillGlobalError}
					<p class="mt-2 text-sm text-danger" role="alert">{fillGlobalError}</p>
				{/if}

				{#if saveValidationError}
					<p class="mt-2 text-sm text-danger" role="alert">{saveValidationError}</p>
				{/if}
			{/if}

			<div class={cn('relative mb-1 min-h-[8.5rem]', !isSaveResultVisible && 'mt-2')}>
				{#if isSaveResultVisible}
					{#if saveStatus === 'success'}
						<div data-testid={E2E_TEST_IDS.popover.saveStatusSuccess}>
							<AddQawSaveStatusPanel
								variant="success"
								header={m['features.quickly-added-words.add-popover.save_success.header']()}
								description={m['features.quickly-added-words.add-popover.save_success.description']()}
								primaryButton={{
									label: m['features.quickly-added-words.add-popover.save_success.done'](),
									onClick: handleSaveDone
								}}
							/>
						</div>
					{:else}
						<div data-testid={E2E_TEST_IDS.popover.saveStatusError}>
							<AddQawSaveStatusPanel
								variant="error"
								header={m['features.quickly-added-words.add-popover.save_error.header']()}
								description={saveError ??
									m['features.quickly-added-words.add-popover.save_error.description']()}
								primaryButton={{
									label: m['features.quickly-added-words.add-popover.save_error.try_again'](),
									onClick: handleSave
								}}
								secondaryButton={{
									label: m['features.quickly-added-words.add-popover.save_error.back_to_form'](),
									onClick: handleSaveBackToForm
								}}
							/>
						</div>
					{/if}
				{:else}
					<div
						bind:this={recordsScrollEl}
						class={cn(
							'flex min-h-0 flex-col gap-1',
							isRecordsScrollable && 'overflow-y-auto overscroll-contain pr-1',
							saveStatus === 'loading' && 'pointer-events-none opacity-50'
						)}
						style:max-height={isRecordsScrollable ? `${recordsScrollMaxHeightPx}px` : undefined}
					>
						{#each addQAWPopoverStore.values as wordRecord, index (index)}
							{#if index !== 0}
								<Divider />
							{/if}

							<div class="flex w-full flex-col gap-1">
								<div class="flex w-full flex-wrap gap-1">
									<Input
										placeholder={m['features.quickly-added-words.add-popover.word_placeholder']()}
										class="min-w-[9rem] flex-1 basis-[12rem]"
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
										placeholder={m['features.quickly-added-words.add-popover.translation_placeholder']()}
										class="min-w-[9rem] flex-1 basis-[12rem]"
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
										buttonClass="w-full min-w-[9rem] basis-[10rem] sm:w-[160px] sm:flex-none"
										optionLeading={wordTypeOptionLeading}
									/>

									<IconButton
										type="OUTLINED"
										variant="DELETE"
										ariaLabel={m['features.quickly-added-words.add-popover.remove_record']()}
										onClick={() => addQAWPopoverStore.removeRecord(index)}
										icon={Minus}
										disabled={isBusy}
									/>
								</div>

								{#if wordRecord.aiError}
									<p class="text-xs text-danger" role="alert">
										{getRowFillErrorMessage(wordRecord.aiError as WordFillGapsRowErrorCode)}
									</p>
								{/if}

								<div class="flex items-center gap-2">
									<Switch.Root
										checked={wordRecord.isDescriptionEnabled}
										onCheckedChange={(checked) => {
											wordRecord.isDescriptionEnabled = checked;
										}}
										disabled={isBusy}
										class="inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-line bg-accent-soft p-0.5 transition-colors data-[state=checked]:bg-ink disabled:cursor-not-allowed disabled:opacity-50"
									>
										<Switch.Thumb
											class="block size-4 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-4"
										/>
									</Switch.Root>

									<AutoHeightTextarea
										formField
										LINE_HEIGHT={20}
										className="min-h-[40px] flex items-center flex-1"
										placeholder={m['features.quickly-added-words.add-popover.description_placeholder']()}
										disabled={!wordRecord.isDescriptionEnabled || isBusy}
										bind:value={wordRecord.definition}
									/>
								</div>
							</div>
						{/each}
					</div>

					{#if saveStatus === 'loading'}
						<div
							data-testid={E2E_TEST_IDS.popover.saveStatusLoading}
							class="absolute inset-0 flex items-center justify-center rounded-md bg-canvas/50"
							aria-busy="true"
							aria-live="polite"
						>
							<Loader wrapperClass="py-4" />
						</div>
					{/if}
				{/if}
			</div>

			{#if !isSaveResultVisible}
				<div class="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
					<Button
						onClick={handleAddMore}
						type="OUTLINED"
						variant="TEXT"
						disabled={addQAWPopoverStore.values.length >= ADD_QAW_POPOVER_MAX_COUNT || isBusy}
					>
						<Plus class="size-4" />
						<span>{m['features.quickly-added-words.add-popover.add_more']()}</span>
					</Button>

					<Button
						onClick={() => addQAWPopoverStore.reset()}
						type="OUTLINED"
						variant="DELETE"
						disabled={addQAWPopoverStore.values.length === 1 || isBusy}
					>
						<RotateCcw class="size-4" />
						<span>{m['features.quickly-added-words.add-popover.reset']()}</span>
					</Button>

					<div class="ml-auto flex w-full min-w-0 flex-wrap items-stretch justify-end gap-2 sm:w-auto">
						<AiActionButton
							class="h-10 w-full min-w-0 sm:min-w-40 sm:w-auto"
							status={fillButtonStatus}
							disabled={!hasWordToFill || isBusy}
							onclick={handleFillWithAi}
							labels={{
								default: m['features.quickly-added-words.add-popover.fill_with_ai'](),
								loading: fillProgressLabel,
								success: m['components.utils.generate-with-ai.success'](),
								failed: m['components.utils.generate-with-ai.failed']()
							}}
						/>

						<Button class="w-full min-w-0 sm:min-w-32 sm:w-auto" disabled={isBusy} onClick={handleSave}>
							{saveStatus === 'loading'
								? m['features.quickly-added-words.add-popover.saving']()
								: m['features.quickly-added-words.add-popover.save']()}
						</Button>
					</div>
				</div>
			{/if}
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
