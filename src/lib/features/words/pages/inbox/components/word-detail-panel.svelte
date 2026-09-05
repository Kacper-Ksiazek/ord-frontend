<script lang="ts">
	import { createWordQuery } from '$words/api-client';
	import { Badge } from '$lib/components/utils/badge';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { Loader } from '$lib/components/utils/loader';
	import { ScrollableWrapper } from '$lib/components/utils/scrollable-wrapper';
	import { StatusPanel } from '$lib/components/utils/status-panel';
	import { parseEmphasisText } from '$lib/utils/text/parse-emphasis-text';
	import {
		getWordExtraMarkLabel,
		getWordTypeBadgeColor,
		getWordTypeLabel
	} from '$words/shared/constants';
	import * as m from '$lib/paraglide/messages.js';
	import { X } from 'lucide-svelte';
	import { closeWordDetail, getWordDetailContext } from '../contexts/word-detail-context.svelte';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';

	const wordDetailContext = getWordDetailContext();

	const wordQuery = createWordQuery(() => wordDetailContext.selectedWordId);

	const word = $derived(wordQuery.data);

	function handleClose() {
		closeWordDetail(wordDetailContext);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="flex h-full w-full min-h-0 min-w-0 flex-col overflow-hidden"
	data-testid={E2E_TEST_IDS.inbox.detailPanel}
	aria-hidden={!wordDetailContext.isOpened}
>
	{#if wordDetailContext.selectedWordId}
		<div
			class="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border border-line-subtle bg-surface"
		>
			<div
				class="flex shrink-0 items-start justify-between gap-3 border-b border-line-subtle px-6 py-5"
			>
				<div class="min-w-0">
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
						</div>
						{#if word.translation}
							<p class="mt-0.5 text-base text-ink-muted">{word.translation}</p>
						{/if}
					{:else if wordQuery.isLoading}
						<div class="mt-3 h-8 w-40 animate-pulse rounded-lg bg-accent-soft"></div>
					{/if}
				</div>

				<IconButton
					type="OUTLINED"
					variant="TEXT"
					icon={X}
					ariaLabel={m['features.words.inbox.detail.close']()}
					dataTestId={E2E_TEST_IDS.inbox.detailClose}
					onClick={handleClose}
				/>
			</div>

			<ScrollableWrapper wrapperClass="min-h-0 flex-1" contentClass="gap-6">
				{#if wordQuery.isLoading}
					<div class="flex items-center justify-center py-16">
						<Loader />
					</div>
				{:else if wordQuery.isError}
					<StatusPanel
						variant="error"
						header={m['features.words.inbox.detail.error_header']()}
						description={wordQuery.error?.message || m['features.words.inbox.detail.error_description']()}
						primaryButton={{
							label: m['features.words.inbox.detail.try_again'](),
							onClick: () => wordQuery.refetch()
						}}
					/>
				{:else if word}
					<div class="flex flex-col gap-6 px-6 py-5">
						{#if word.extraMark || word.bank?.name || word.progress}
							<div class="flex flex-wrap items-center gap-1.5">
								{#if word.extraMark}
									<Badge color="gray">{getWordExtraMarkLabel(word.extraMark)}</Badge>
								{/if}
								{#if word.bank?.name}
									<span
										class="inline-flex items-center gap-1.5 rounded-[10px] bg-accent-soft px-2 py-0.5 text-xs font-medium text-ink-muted"
									>
										{#if word.bank.bankGroup?.color}
											<span
												class="size-2 rounded-full"
												style:background-color={word.bank.bankGroup.color}
												aria-hidden="true"
											></span>
										{/if}
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
							<section class="flex flex-col gap-2">
								<h3 class="text-sm font-medium text-ink">
									{m['features.words.inbox.detail.definition']()}
								</h3>
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
							</section>
						{/if}

						{#if word.details}
							{@const details = word.details}

							{#if details.useCases?.length}
								<section class="flex flex-col gap-2">
									<h3 class="text-sm font-medium text-ink">
										{m['features.words.inbox.detail.use_cases']()}
									</h3>
									<ul class="list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-muted">
										{#each details.useCases as useCase (useCase)}
											<li>{useCase}</li>
										{/each}
									</ul>
								</section>
							{/if}

							{#if details.synonyms?.length}
								<section class="flex flex-col gap-2">
									<h3 class="text-sm font-medium text-ink">
										{m['features.words.inbox.detail.synonyms']()}
									</h3>
									<p class="text-sm leading-relaxed text-ink-muted">
										{details.synonyms.join(', ')}
									</p>
								</section>
							{/if}

							{#if details.antonyms?.length}
								<section class="flex flex-col gap-2">
									<h3 class="text-sm font-medium text-ink">
										{m['features.words.inbox.detail.antonyms']()}
									</h3>
									<p class="text-sm leading-relaxed text-ink-muted">
										{details.antonyms.join(', ')}
									</p>
								</section>
							{/if}

							{#if details.exampleSentences?.length}
								<section class="flex flex-col gap-3">
									<h3 class="text-sm font-medium text-ink">
										{m['features.words.inbox.detail.example_sentences']()}
									</h3>
									<div class="flex flex-col gap-3">
										{#each details.exampleSentences as example (example.sentence)}
											<div class="rounded-xl border border-line-subtle bg-canvas px-4 py-3">
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
												<p class="mt-1 text-sm text-ink-muted">{example.translation}</p>
											</div>
										{/each}
									</div>
								</section>
							{/if}

							{#if details.collocations?.length}
								<section class="flex flex-col gap-2">
									<h3 class="text-sm font-medium text-ink">
										{m['features.words.inbox.detail.collocations']()}
									</h3>
									<ul class="list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-muted">
										{#each details.collocations as collocation (collocation.phrase)}
											<li>
												<span class="text-ink">{collocation.phrase}</span>
												{#if collocation.translation}
													<span> — {collocation.translation}</span>
												{/if}
											</li>
										{/each}
									</ul>
								</section>
							{/if}

							{#if details.commonMistakes?.length}
								<section class="flex flex-col gap-2">
									<h3 class="text-sm font-medium text-ink">
										{m['features.words.inbox.detail.common_mistakes']()}
									</h3>
									<ul class="list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-muted">
										{#each details.commonMistakes as mistake (mistake)}
											<li>{mistake}</li>
										{/each}
									</ul>
								</section>
							{/if}
						{:else}
							<StatusPanel
								variant="information"
								header={m['features.words.inbox.detail.no_details_header']()}
								description={m['features.words.inbox.detail.no_details_description']()}
							/>
						{/if}
					</div>
				{/if}
			</ScrollableWrapper>
		</div>
	{/if}
</div>
