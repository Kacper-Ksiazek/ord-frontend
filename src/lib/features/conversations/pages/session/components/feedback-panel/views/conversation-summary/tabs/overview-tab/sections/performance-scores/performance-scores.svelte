<script lang="ts">
	import type { ConversationUserMessageAnalysisDTO } from '$conversations/types';
	import { cn } from '$lib/utils/cn';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import { CircularProgressBars, ProgressTableHeader } from './components';
	import type { CompactConversationUserMessage } from '$conversations/types';
	import { ScoreBox } from '$lib/components/scores';

	const COLLAPSED_ROW_LIMIT = 5;

	interface PerformanceScoresProps {
		userMessages: CompactConversationUserMessage[];
		analyses: ConversationUserMessageAnalysisDTO[];
	}

	const { userMessages, analyses }: PerformanceScoresProps = $props();

	let isListExpanded = $state(false);

	const orderedChronologicalAsc = $derived(
		[...userMessages].sort(
			(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
		)
	);

	const orderedNewestFirst = $derived([...orderedChronologicalAsc].reverse());

	const visibleRows = $derived(
		isListExpanded ? orderedNewestFirst : orderedNewestFirst.slice(0, COLLAPSED_ROW_LIMIT)
	);

	const hasMoreRowsThanLimit = $derived(orderedNewestFirst.length > COLLAPSED_ROW_LIMIT);

	const hiddenRowCount = $derived(Math.max(0, orderedNewestFirst.length - COLLAPSED_ROW_LIMIT));

	function chronologicalIndex(message: CompactConversationUserMessage) {
		return orderedChronologicalAsc.indexOf(message) + 1;
	}
</script>

<div class="space-y-6">
	<h3 class="heading-5">Performance Scores</h3>

	<CircularProgressBars {analyses} />

	<div class="space-y-4">
		<div class="overflow-x-auto">
			<table
				class={cn(
					'w-full text-sm text-muted-small text-left', //
					'[&_th]:px-2 [&_th]:py-3 [&_td]:px-2 [&_td]:py-3'
				)}
			>
				<ProgressTableHeader />

				<tbody>
					{#each visibleRows as message (message.createdAt + message.content.slice(0, 48))}
						{@const rowNumber = chronologicalIndex(message)}
						{@const trimmedMessage =
							message.content.length > 50 ? message.content.substring(0, 60) + '...' : message.content}

						<tr
							class="bg-surface border-b border-line cursor-pointer transition-colors hover:bg-accent-soft"
							onclick={() => alert(`Message ${rowNumber}`)}
							role="button"
							tabindex="0"
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									alert(`Message ${rowNumber}`);
								}
							}}
						>
							<td class="text-xs text-ink-muted">{rowNumber}.</td>
							<td class="body-small">
								{trimmedMessage}
							</td>

							<td>
								<ScoreBox score={message.analysis?.grammar ?? null} />
							</td>

							<td>
								<ScoreBox score={message.analysis?.vocabulary ?? null} />
							</td>

							<td>
								<ScoreBox score={message.analysis?.naturalness ?? null} />
							</td>
						</tr>
					{/each}
				</tbody>
			</table>

			{#if hasMoreRowsThanLimit}
				<div class="flex justify-center border-t border-line pt-2">
					<button
						type="button"
						class={cn(
							'inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-ink-muted transition-colors',
							'hover:bg-accent-soft hover:text-ink-body'
						)}
						onclick={() => (isListExpanded = !isListExpanded)}
						aria-expanded={isListExpanded}
					>
						{#if isListExpanded}
							<ChevronUp class="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
							<span>Show fewer</span>
						{:else}
							<ChevronDown class="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
							<span>Show {hiddenRowCount} more</span>
						{/if}
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
