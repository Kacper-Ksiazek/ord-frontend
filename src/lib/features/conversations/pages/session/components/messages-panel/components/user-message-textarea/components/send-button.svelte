<script lang="ts">
	import { Button, Spinner, cn } from 'flowbite-svelte';
	import { Send } from 'lucide-svelte';

	interface Props {
		disabled?: boolean;
		pending?: boolean;
		onclick?: (e: MouseEvent) => void;
	}

	let { disabled = false, pending = false, onclick }: Props = $props();
</script>

<Button
	class={cn(
		'p-3 rounded-xl bg-transparent transition-all duration-200',
		disabled && 'cursor-not-allowed opacity-30',
		pending && 'bg-gray-400 cursor-wait',
		'hover:bg-gray-100 dark:hover:bg-gray-800'
	)}
	{disabled}
	{onclick}
>
	{#if pending}
		<Spinner size="4" class="fill-gray-700 dark:fill-gray-300" />
	{:else}
		<Send class="w-5 h-5 text-gray-700 dark:text-gray-300" />
	{/if}
</Button>
