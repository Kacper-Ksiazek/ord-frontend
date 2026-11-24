<script lang="ts">
	import { Send } from 'lucide-svelte';
	import { Spinner } from '$lib/components/utils/spinner';
	import { cn } from '$lib/utils/cn';

	interface Props {
		disabled?: boolean;
		pending?: boolean;
		ariaLabel: string;
		dataTestId?: string;
		onclick?: (e: MouseEvent) => void;
	}

	let { disabled = false, pending = false, ariaLabel, dataTestId, onclick }: Props = $props();
</script>

<button
	type="button"
	data-testid={dataTestId}
	class={cn(
		'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-transparent p-0 transition-colors',
		disabled && 'cursor-not-allowed opacity-30',
		pending && 'cursor-wait',
		!disabled && !pending && 'hover:bg-accent-soft text-primary-600 dark:text-primary-400'
	)}
	{disabled}
	aria-label={ariaLabel}
	{onclick}
>
	{#if pending}
		<Spinner class="text-ink" />
	{:else}
		<Send class="size-4 text-ink" />
	{/if}
</button>
