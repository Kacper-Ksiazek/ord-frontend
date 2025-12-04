<script lang="ts">
	import { cn } from 'flowbite-svelte';

	interface Props {
		note: string;
	}

	let { note }: Props = $props();
</script>

<div
	class="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border-2 border-indigo-300 dark:border-indigo-700 shadow-sm"
>
	<p class="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
		{note}
	</p>
</div>
