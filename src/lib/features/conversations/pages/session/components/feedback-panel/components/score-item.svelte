<script lang="ts">
	import { Badge, cn } from 'flowbite-svelte';
	import { getScoreColor } from '../feedback-panel.utils';

	interface Props {
		label: string;
		score: number;
	}

	let { label, score }: Props = $props();

	const color = $derived(getScoreColor(score));
</script>

<div
	class="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
>
	<span class="font-medium text-gray-900 dark:text-gray-100">{label}</span>
	<Badge {color} large>
		{score}/10
	</Badge>
</div>
