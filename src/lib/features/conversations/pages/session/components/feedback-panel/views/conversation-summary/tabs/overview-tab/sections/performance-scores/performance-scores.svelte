<script lang="ts">
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { cn } from 'flowbite-svelte';
	import { CircularProgressBars, ProgressTableHeader } from './components';
	import type { CompactConversationUserMessage } from '$lib/types/conversation/domain/conversation-message';
	import { ChevronRight } from 'lucide-svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { ScoreBox } from '$lib/components/scores';

	interface PerformanceScoresProps {
		userMessages: CompactConversationUserMessage[];
		feedbacks: ConversationUserMessageFeedbackDTO[];
	}

	const { userMessages, feedbacks }: PerformanceScoresProps = $props();
</script>

<div class="space-y-6">
	<h3 class="heading-5">Performance Scores</h3>

	<CircularProgressBars {feedbacks} />

	<div class="space-y-4">
		<div class="overflow-x-auto">
			<table
				class={cn(
					'w-full text-sm text-muted-small text-left', //
					'[&_th]:px-4 [&_th]:py-3 [&_td]:px-4 [&_td]:py-3'
				)}
			>
				<ProgressTableHeader />

				<tbody>
					{#each userMessages as message, index (index)}
						{@const trimmedMessage =
							message.content.length > 50 ? message.content.substring(0, 60) + '...' : message.content}

						<tr class="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
							<td class="label">{index + 1}</td>
							<td class="body-xs">{trimmedMessage}</td>

							<td>
								<ScoreBox score={message.feedback?.grammar ?? null} />
							</td>

							<td>
								<ScoreBox score={message.feedback?.vocabulary ?? null} />
							</td>

							<td>
								<ScoreBox score={message.feedback?.naturalness ?? null} />
							</td>

							<td>
								<IconButton
									icon={ChevronRight}
									ariaLabel="Show message details"
									type="OUTLINED"
									variant="TEXT"
									onClick={() => alert(`Message ${index + 1}`)}
								/>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Legend -->
		<div class="flex flex-wrap items-center gap-4 caption">
			<span>G = Grammar</span>
			<span>V = Vocabulary</span>
			<span>N = Naturalness</span>
		</div>
	</div>
</div>
