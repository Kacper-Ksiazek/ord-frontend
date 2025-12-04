<script lang="ts">
	import { Badge, cn } from 'flowbite-svelte';
	import type { ConversationMessageMistake } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { getSeverityColor } from '../feedback-panel.utils';

	interface Props {
		mistake: ConversationMessageMistake;
	}

	let { mistake }: Props = $props();

	const severityColor = $derived(getSeverityColor(mistake.severity));
</script>

<div
	class="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border-2 border-red-300 dark:border-red-700 shadow-sm"
>
	<div class="flex items-start justify-between mb-2">
		<Badge color={severityColor}>
			Severity: {mistake.severity}
		</Badge>
		<Badge color="gray">{mistake.errorType}</Badge>
	</div>
	<div class="mb-3">
		<p class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Phrase:</p>
		<p
			class="text-sm bg-white dark:bg-gray-800 p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
		>
			"{mistake.phrase}"
		</p>
	</div>
	<div class="mb-3">
		<p class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Correct form:</p>
		<p
			class="text-sm bg-green-100 dark:bg-green-900/40 p-3 rounded-lg border-2 border-green-400 dark:border-green-600 text-gray-900 dark:text-gray-100"
		>
			"{mistake.correctForm}"
		</p>
	</div>
	<div>
		<p class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Explanation:</p>
		<p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
			{mistake.explanation}
		</p>
	</div>
</div>
