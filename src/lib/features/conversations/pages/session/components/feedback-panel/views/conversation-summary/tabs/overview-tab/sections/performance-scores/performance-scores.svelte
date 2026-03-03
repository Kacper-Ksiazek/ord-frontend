<script lang="ts">
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { cn } from 'flowbite-svelte';
	import { CircularProgressBars, ProgressTableHeader } from './components';
	import type { CompactConversationUserMessage } from '$lib/types/conversation/domain/conversation-message';
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
					'[&_th]:px-2 [&_th]:py-3 [&_td]:px-2 [&_td]:py-3'
				)}
			>
				<ProgressTableHeader />

				<tbody>
					{#each userMessages as message, index (index)}
						{@const trimmedMessage =
							message.content.length > 50 ? message.content.substring(0, 60) + '...' : message.content}

						<tr
							class="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
							onclick={() => alert(`Message ${index + 1}`)}
							role="button"
							tabindex="0"
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									alert(`Message ${index + 1}`);
								}
							}}
						>
							<td class="text-xs text-gray-500 dark:text-gray-400">{index + 1}.</td>
							<td class="body-small">
								{trimmedMessage}
							</td>

							<td>
								<ScoreBox score={message.feedback?.grammar ?? null} />
							</td>

							<td>
								<ScoreBox score={message.feedback?.vocabulary ?? null} />
							</td>

							<td>
								<ScoreBox score={message.feedback?.naturalness ?? null} />
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
