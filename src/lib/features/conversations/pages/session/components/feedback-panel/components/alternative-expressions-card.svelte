<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { ConversationMessageAlternativeExpression } from '$lib/types/conversation/domain/conversation-message-feedback';

	interface Props {
		alt: ConversationMessageAlternativeExpression;
	}

	let { alt }: Props = $props();
</script>

<div
	class="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border-2 border-purple-300 dark:border-purple-700 shadow-sm"
>
	<div class="mb-3">
		<p class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Context:</p>
		<p
			class="text-sm bg-white dark:bg-gray-800 p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 italic text-gray-900 dark:text-gray-100"
		>
			"{alt.context}"
		</p>
	</div>
	<div class="mb-3">
		<p class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Alternatives:</p>
		<ul class="list-disc list-inside space-y-2 ml-2">
			{#each alt.alternatives as alternative}
				<li class="text-sm text-gray-700 dark:text-gray-300">
					"{alternative}"
				</li>
			{/each}
		</ul>
	</div>
	{#if alt.note}
		<div>
			<p class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Note:</p>
			<p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{alt.note}</p>
		</div>
	{/if}
</div>
