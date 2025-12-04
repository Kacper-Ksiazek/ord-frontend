<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { ConversationMessageVocabularyEnrichment } from '$lib/types/conversation/domain/conversation-message-feedback';

	interface Props {
		enrichment: ConversationMessageVocabularyEnrichment;
	}

	let { enrichment }: Props = $props();
</script>

<div
	class="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-2 border-blue-300 dark:border-blue-700 shadow-sm"
>
	<div class="mb-3">
		<p class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Original:</p>
		<p
			class="text-sm bg-white dark:bg-gray-800 p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
		>
			"{enrichment.original}"
		</p>
	</div>
	<div class="mb-3">
		<p class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Suggestion:</p>
		<p
			class="text-sm bg-green-100 dark:bg-green-900/40 p-3 rounded-lg border-2 border-green-400 dark:border-green-600 text-gray-900 dark:text-gray-100"
		>
			"{enrichment.suggestion}"
		</p>
	</div>
	<div>
		<p class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Explanation:</p>
		<p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
			{enrichment.explanation}
		</p>
	</div>
</div>
