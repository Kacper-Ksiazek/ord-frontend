<script lang="ts">
	import { WandSparkles } from 'lucide-svelte';
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
		'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-transparent p-0 text-ink transition-colors',
		disabled && !pending && 'cursor-not-allowed opacity-30',
		pending && 'cursor-wait',
		!disabled && !pending && 'cursor-pointer hover:bg-accent-soft'
	)}
	disabled={disabled || pending}
	aria-label={ariaLabel}
	title={ariaLabel}
	{onclick}
>
	{#if pending}
		<Spinner class="text-ink" />
	{:else}
		<WandSparkles class="size-4" aria-hidden="true" />
	{/if}
</button>
