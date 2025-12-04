<script lang="ts">
	import { cn } from 'flowbite-svelte';

	interface Props {
		strength: string;
	}

	let { strength }: Props = $props();
</script>

<div
	class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border-2 border-green-300 dark:border-green-700 shadow-sm"
>
	<p class="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">{strength}</p>
</div>
