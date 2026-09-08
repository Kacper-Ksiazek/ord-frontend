<script lang="ts">
	import { createWordQuery } from '$words/api-client';
	import {
		createGenerateWordManualMutation,
		createToggleWordBookmarkMutation,
		createWordDetailsMutation
	} from '$words/api-client/mutations';
	import { getWordBookmarked } from '$words/api-client/utils/normalize-word-list-item';
	import { AiActionButton } from '$lib/components/buttons/ai-action-button';
	import { Button } from '$lib/components/buttons/button';
	import { Badge } from '$lib/components/utils/badge';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import { PlayTextAudio } from '$lib/components/utils/play-text-audio';
	import { StatusPanel } from '$lib/components/utils/status-panel';
	import { parseEmphasisText, stripEmphasisMarkers } from '$lib/utils/text/parse-emphasis-text';
	import { capitalizeFirstLetter } from '$lib/utils/text/capitalize-first-letter';
	import { cn } from '$lib/utils/cn';
	import { getWordTypeBadgeColor, getWordTypeLabel } from '$words/shared/constants';
	import BankGroupColorDot from '$words/shared/components/bank-group-color-dot.svelte';
	import WordExtraMarkBadge from '$words/shared/components/word-extra-mark-badge.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { ArrowRight, CornerDownRight, PenLine, X } from 'lucide-svelte';
	import { closeWordDetail, getWordDetailContext } from '../contexts/word-detail-context.svelte';
	import WordDetailManualForm from './word-detail-manual-form.svelte';
	import WordBookmarkButton from './word-bookmark-button.svelte';
	import WordDetailPanelSkeleton from './word-detail-panel-skeleton.svelte';
	import WordDetailPanelAiSkeleton from './word-detail-panel-ai-skeleton.svelte';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';
	import { toast } from '$lib/components/utils/toast';
	import { getApiErrorMessage } from '$lib/utils/get-api-error-message';
	import type { CreateWordDetailsRequest } from '$words/api-client/api/http-post-create-word-details';
	import type { AiActionButtonProps } from '$lib/components/buttons/ai-action-button/ai-action-button.types';
	import type { SingleWordResponse } from '$words/types';

	interface Props {
		bookmarkedOnlyFilter?: boolean;
	}

	let { bookmarkedOnlyFilter = false }: Props = $props();

	const wordDetailContext = getWordDetailContext();

	const selectedWordId = $derived(wordDetailContext.selectedWordId);
	const selectedWordPreview = $derived(wordDetailContext.selectedWordPreview);

	const wordQuery = createWordQuery(
		() => selectedWordId,
		() =>
			selectedWordPreview?.id && selectedWordPreview.id === selectedWordId
				? (selectedWordPreview as SingleWordResponse)
				: undefined
	);
	const generateWordManualMutation = createGenerateWordManualMutation();
	const wordDetailsMutation = createWordDetailsMutation();
	const bookmarkMutation = createToggleWordBookmarkMutation();

	const word = $derived(wordQuery.data?.id === selectedWordId ? wordQuery.data : undefined);
	const isDetailLoading = $derived(
		Boolean(selectedWordId) &&
			!word &&
			!wordQuery.isError &&
			(wordQuery.isPending || wordQuery.isFetching)
	);
	const isDetailsSectionLoading = $derived(
		Boolean(word) && wordQuery.isFetching && !word?.details && !generateWordManualMutation.isPending
	);
	const isAiGeneratingDetails = $derived(generateWordManualMutation.isPending);
	let isManualEditing = $state(false);
	let aiButtonStatus = $state<AiActionButtonProps['status']>('default');

	const isManualBusy = $derived(
		generateWordManualMutation.isPending || wordDetailsMutation.isPending
	);
	const headerSourceWord = $derived(word?.sourceWord ?? selectedWordPreview?.sourceWord ?? '');
	const isBookmarked = $derived(
		word
			? getWordBookmarked(word)
			: selectedWordPreview?.id === selectedWordId
				? getWordBookmarked(selectedWordPreview)
				: false
	);
	const isBookmarkToggling = $derived(
		Boolean(selectedWordId) &&
			bookmarkMutation.isPending &&
			bookmarkMutation.variables?.wordId === selectedWordId
	);

	function resetManualEditing() {
		isManualEditing = false;
	}

	async function handleGenerateWithAi() {
		if (!word?.sourceWord || !word.language || !wordDetailContext.selectedWordId) {
			return;
		}

		aiButtonStatus = 'loading';

		const aiToast = toast.aiProgress(
			m['components.utils.toast.ai_thinking_1'](),
			m['components.utils.toast.title_ai_pending']()
		);

		try {
			await generateWordManualMutation.mutateAsync({
				wordId: wordDetailContext.selectedWordId,
				request: {
					word: word.sourceWord,
					language: word.language
				}
			});
			aiButtonStatus = 'success';
			resetManualEditing();
			aiToast.success(m['features.words.inbox.detail.generate_with_ai_success']());
		} catch (error) {
			aiButtonStatus = 'failed';
			aiToast.error(
				getApiErrorMessage(error, m['features.words.inbox.detail.generate_with_ai_error']())
			);
		}
	}

	async function handleSaveManualDetails(request: CreateWordDetailsRequest) {
		if (!wordDetailContext.selectedWordId) {
			return;
		}

		try {
			await wordDetailsMutation.mutateAsync({
				wordId: wordDetailContext.selectedWordId,
				request
			});
			resetManualEditing();
			toast.success(m['features.words.inbox.detail.manual_save_success']());
		} catch (error) {
			toast.error(getApiErrorMessage(error, m['features.words.inbox.detail.manual_save_error']()));
		}
	}

	function handleClose() {
		resetManualEditing();
		closeWordDetail(wordDetailContext);
	}

	$effect(() => {
		void wordDetailContext.selectedWordId;
		resetManualEditing();
		aiButtonStatus = 'default';
	});

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="flex h-full min-h-0 w-full flex-col overflow-hidden"
	data-testid={E2E_TEST_IDS.inbox.detailPanel}
	aria-hidden={!wordDetailContext.isOpened}
>
	{#if wordDetailContext.selectedWordId}
		<div
			class="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-[10px] border border-line bg-surface"
		>
			<div
				class="flex w-full shrink-0 items-start justify-between gap-3 rounded-t-[10px] border-b border-line bg-surface px-6 py-5"
			>
				<div class="min-w-0 flex-1">
					<p class="text-xs font-medium uppercase tracking-wide text-ink-subtle">
						{m['features.words.inbox.detail.title']()}
					</p>

					{#if word}
						<div class="mt-1 flex flex-wrap items-center gap-2">
							<h2 class="text-2xl font-semibold text-ink">{word.sourceWord}</h2>
							{#if word.type}
								<Badge color={getWordTypeBadgeColor(word.type)}>
									{getWordTypeLabel(word.type)}
								</Badge>
							{/if}
							<PlayTextAudio
								text={word.sourceWord}
								id={`source-word-${selectedWordId}`}
								dataTestId={E2E_TEST_IDS.inbox.detailSourceWordTts}
							/>
							{#if selectedWordId}
								<WordBookmarkButton
									bookmarked={isBookmarked}
									disabled={isBookmarkToggling}
									ariaLabel={isBookmarked
										? m['features.words.inbox.row.remove_bookmark']({ word: headerSourceWord })
										: m['features.words.inbox.row.add_bookmark']({ word: headerSourceWord })}
									dataTestId={E2E_TEST_IDS.inbox.detailBookmark}
									onToggle={() => {
										bookmarkMutation.mutate({
											wordId: selectedWordId,
											bookmarkedOnlyFilter
										});
									}}
								/>
							{/if}
						</div>
						{#if word.translation}
							<p class="mt-0.5 text-base text-ink-muted">{word.translation}</p>
						{/if}
					{:else if isDetailLoading}
						<div class="mt-1 flex flex-col gap-2.5">
							<div class="flex items-center gap-2">
								<Skeleton class="h-8 w-44 rounded-lg bg-accent-soft" />
								<Skeleton class="h-6 w-14 rounded-[10px] bg-accent-soft" />
							</div>
							<Skeleton class="h-5 w-36 rounded-lg bg-accent-soft" />
						</div>
					{/if}
				</div>

				<IconButton
					class="shrink-0"
					type="OUTLINED"
					variant="TEXT"
					icon={X}
					ariaLabel={m['features.words.inbox.detail.close']()}
					dataTestId={E2E_TEST_IDS.inbox.detailClose}
					onClick={handleClose}
				/>
			</div>

			<div class="flex min-h-0 flex-1 flex-col overflow-hidden">
				{#if isDetailLoading}
					<WordDetailPanelSkeleton />
				{:else if wordQuery.isError}
					<div class="flex flex-1 items-center px-6 py-5">
						<StatusPanel
							class="w-full"
							variant="error"
							header={m['features.words.inbox.detail.error_header']()}
							description={wordQuery.error?.message ||
								m['features.words.inbox.detail.error_description']()}
							primaryButton={{
								label: m['features.words.inbox.detail.try_again'](),
								onClick: () => wordQuery.refetch()
							}}
						/>
					</div>
				{:else if word}
					{@const hasExtendedDetails = Boolean(word.details)}
					<div
						class={cn(
							'flex min-h-0 flex-1 flex-col gap-6 px-6 py-5 pb-6',
							hasExtendedDetails || isManualEditing
								? 'overflow-y-auto overflow-x-hidden'
								: 'overflow-hidden'
						)}
					>
						{#if word.extraMark || word.bank?.name || word.progress}
							<div class="flex flex-wrap items-center gap-1.5">
								{#if word.extraMark}
									<WordExtraMarkBadge mark={word.extraMark} />
								{/if}
								{#if word.bank?.name}
									<span
										class="inline-flex items-center gap-1.5 rounded-[10px] bg-accent-soft px-2 py-0.5 text-xs font-medium text-ink-muted"
									>
										<BankGroupColorDot color={word.bank.bankGroup?.color} />
										{word.bank.name}
									</span>
								{/if}
								{#if word.progress?.completed}
									<Badge color="green">{m['features.words.inbox.detail.progress_completed']()}</Badge>
								{:else if word.progress?.points !== undefined}
									<Badge color="gray">
										{m['features.words.inbox.detail.progress_points']({ points: word.progress.points })}
									</Badge>
								{/if}
							</div>
						{/if}

						{#if word.definition}
							<section class="flex flex-col gap-2.5">
								<h3 class="text-sm font-medium text-ink">
									{m['features.words.inbox.detail.definition']()}
								</h3>
								<div class="rounded-xl border border-line-subtle bg-canvas px-4 py-3">
									<p class="text-sm leading-relaxed text-ink-muted">
										{#each parseEmphasisText(word.definition) as part, index (index)}
											{#if part.emphasized}
												<span class="rounded-md bg-highlight/90 px-1 py-px font-medium text-ink">
													{part.text}
												</span>
											{:else}
												{part.text}
											{/if}
										{/each}
									</p>
								</div>
							</section>
						{/if}

						{#if word.details}
							{@const details = word.details}

							{#if details.useCases?.length}
								<section class="flex flex-col gap-2.5">
									<h3 class="text-sm font-medium text-ink">
										{m['features.words.inbox.detail.use_cases']()}
									</h3>
									<div class="flex flex-col gap-2">
										{#each details.useCases as useCase (useCase)}
											<div
												class="flex items-center gap-2.5 rounded-xl border border-line-subtle bg-canvas px-3.5 py-2.5"
											>
												<ArrowRight class="size-3.5 shrink-0 text-ink-subtle" aria-hidden="true" />
												<p class="min-w-0 flex-1 text-sm leading-relaxed text-ink-muted">
													{capitalizeFirstLetter(useCase)}
												</p>
											</div>
										{/each}
									</div>
								</section>
							{/if}

							{#if details.synonyms?.length}
								<section class="flex flex-col gap-2.5">
									<h3 class="text-sm font-medium text-ink">
										{m['features.words.inbox.detail.synonyms']()}
									</h3>
									<div class="flex flex-wrap gap-2">
										{#each details.synonyms as synonym (synonym)}
											<Badge color="blue" class="px-2.5 py-1">{synonym}</Badge>
										{/each}
									</div>
								</section>
							{/if}

							{#if details.antonyms?.length}
								<section class="flex flex-col gap-2.5">
									<h3 class="text-sm font-medium text-ink">
										{m['features.words.inbox.detail.antonyms']()}
									</h3>
									<div class="flex flex-wrap gap-2">
										{#each details.antonyms as antonym (antonym)}
											<Badge color="red" class="px-2.5 py-1">{antonym}</Badge>
										{/each}
									</div>
								</section>
							{/if}

							{#if details.exampleSentences?.length}
								<section class="flex flex-col gap-3">
									<h3 class="text-sm font-medium text-ink">
										{m['features.words.inbox.detail.example_sentences']()}
									</h3>
									<div class="flex flex-col gap-3">
										{#each details.exampleSentences as example, exampleIndex (example.sentence)}
											<div class="rounded-xl border border-line-subtle bg-canvas px-4 py-3">
												<div class="flex items-start gap-2">
													<div class="min-w-0 flex-1">
														{#if example.context}
															<p class="mb-1 text-xs font-medium uppercase tracking-wide text-ink-subtle">
																{example.context}
															</p>
														{/if}
														<p class="text-sm leading-relaxed text-ink">
															{#each parseEmphasisText(example.sentence) as part, index (index)}
																{#if part.emphasized}
																	<span class="rounded-md bg-highlight/90 px-1 py-px font-medium">
																		{part.text}
																	</span>
																{:else}
																	{part.text}
																{/if}
															{/each}
														</p>
													</div>
													<PlayTextAudio
														text={stripEmphasisMarkers(example.sentence)}
														id={`example-sentence-${selectedWordId}-${exampleIndex}`}
														dataTestId={E2E_TEST_IDS.inbox.detailExampleSentenceTts(exampleIndex)}
													/>
												</div>
												{#if example.translation}
													<div class="mt-2 flex items-start gap-2 border-l border-line-subtle pl-3">
														<CornerDownRight
															class="mt-0.5 size-3.5 shrink-0 text-ink-subtle"
															aria-hidden="true"
														/>
														<p class="min-w-0 flex-1 text-sm leading-relaxed text-ink-muted">
															{#each parseEmphasisText(example.translation) as part, index (index)}
																{#if part.emphasized}
																	<span class="rounded-md bg-highlight/90 px-1 py-px font-medium text-ink">
																		{part.text}
																	</span>
																{:else}
																	{part.text}
																{/if}
															{/each}
														</p>
													</div>
												{/if}
											</div>
										{/each}
									</div>
								</section>
							{/if}

							{#if details.collocations?.length}
								<section class="flex flex-col gap-2.5">
									<h3 class="text-sm font-medium text-ink">
										{m['features.words.inbox.detail.collocations']()}
									</h3>
									<div class="flex flex-col gap-2">
										{#each details.collocations as collocation (collocation.phrase)}
											<div class="rounded-xl border border-line-subtle bg-canvas px-3 py-2.5">
												<span class="text-sm font-medium text-ink">{collocation.phrase}</span>
												{#if collocation.translation}
													<span class="px-1 text-ink-subtle" aria-hidden="true">·</span>
													<span class="text-sm text-ink-muted">{collocation.translation}</span>
												{/if}
											</div>
										{/each}
									</div>
								</section>
							{/if}

							{#if details.commonMistakes?.length}
								<section class="flex flex-col gap-2.5">
									<h3 class="text-sm font-medium text-ink">
										{m['features.words.inbox.detail.common_mistakes']()}
									</h3>
									<div class="flex flex-col gap-2">
										{#each details.commonMistakes as mistake (mistake)}
											<div
												class="rounded-xl border border-danger/15 bg-danger/5 px-3 py-2.5 text-sm leading-relaxed text-ink-muted"
											>
												{#each parseEmphasisText(mistake) as part, index (index)}
													{#if part.emphasized}
														<span class="rounded-md bg-highlight/90 px-1 py-px font-medium text-ink">
															{part.text}
														</span>
													{:else}
														{part.text}
													{/if}
												{/each}
											</div>
										{/each}
									</div>
								</section>
							{/if}
						{:else if isAiGeneratingDetails}
							<WordDetailPanelAiSkeleton />
						{:else if isDetailsSectionLoading}
							<WordDetailPanelSkeleton />
						{:else if isManualEditing}
							<WordDetailManualForm
								disabled={isManualBusy}
								onCancel={resetManualEditing}
								onSave={handleSaveManualDetails}
							/>
						{:else}
							<div
								class="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 px-6 py-8"
								data-testid={E2E_TEST_IDS.inbox.detailEmptyState}
							>
								<StatusPanel
									class="flex-none !px-0 !py-0"
									variant="information"
									header={m['features.words.inbox.detail.no_details_header']()}
									description={m['features.words.inbox.detail.no_details_description']()}
								/>

								<div class="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:justify-center">
									<AiActionButton
										class="h-10 w-full sm:min-w-44 sm:w-auto"
										bind:status={aiButtonStatus}
										disabled={isManualBusy || !word.sourceWord || !word.language}
										onclick={handleGenerateWithAi}
										labels={{
											default: m['features.words.inbox.detail.generate_with_ai'](),
											loading: m['features.words.inbox.detail.generate_with_ai_loading'](),
											success: m['components.utils.generate-with-ai.success'](),
											failed: m['components.utils.generate-with-ai.failed']()
										}}
									/>

									<Button
										type="OUTLINED"
										variant="TEXT"
										class="h-10 w-full sm:min-w-44 sm:w-auto"
										disabled={isManualBusy}
										dataTestId={E2E_TEST_IDS.inbox.detailFillManually}
										onClick={() => {
											isManualEditing = true;
										}}
									>
										<PenLine class="size-4 shrink-0" aria-hidden="true" />
										{m['features.words.inbox.detail.fill_manually']()}
									</Button>
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
