<script lang="ts">
	import { Button, Spinner, cn } from 'flowbite-svelte';
	import { PaperPlaneSolid } from 'flowbite-svelte-icons';

	interface Props {
		disabled?: boolean;
		pending?: boolean;
		onclick?: (e: MouseEvent) => void;
	}

	let { disabled = false, pending = false, onclick }: Props = $props();
</script>

<Button
	class={cn(
		'p-3 rounded-xl',
		!disabled && !pending && 'bg-primary-600 hover:bg-primary-700',
		disabled && 'bg-gray-300 cursor-not-allowed',
		pending && 'bg-gray-400 cursor-wait'
	)}
	{disabled}
	{onclick}
>
	{#if pending}
		<Spinner size="4" class="fill-white" />
	{:else}
		<PaperPlaneSolid class="w-5 h-5 text-white" />
	{/if}
</Button>
