<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { ServerCrash, Info, CheckCircle2 } from 'lucide-svelte';
	import { Button } from '$lib/components/buttons/button';
	import type { StatusButtonProps, StatusScreenVariant } from './status-screen.types';

	interface Props {
		variant?: StatusScreenVariant;
		header?: string;
		code?: string | number;
		description?: string;
		primaryButton?: StatusButtonProps;
		secondaryButton?: StatusButtonProps;
		class?: string;
	}

	const {
		variant = 'error',
		header,
		code,
		description,
		primaryButton,
		secondaryButton,
		class: customClass = ''
	}: Props = $props();

	const iconContainerClass = $derived(
		variant === 'error'
			? 'bg-red-50 dark:bg-red-950/30'
			: variant === 'information'
				? 'bg-blue-50 dark:bg-blue-950/30'
				: 'bg-green-50 dark:bg-green-950/30'
	);

	const iconClass = $derived(
		variant === 'error'
			? 'w-8 h-8 text-red-400 dark:text-red-500'
			: variant === 'information'
				? 'w-8 h-8 text-blue-400 dark:text-blue-500'
				: 'w-8 h-8 text-green-400 dark:text-green-500'
	);

	// Primary button uses FILLED with a variant-matched color.
	// 'success' has no native green ButtonVariant, so we override via class.
	const primaryButtonVariant = $derived(variant === 'error' ? 'DELETE' : 'PRIMARY');

	const primaryButtonClass = $derived(
		variant === 'success'
			? cn(
					'bg-green-600 border-green-600 hover:bg-green-700',
					'dark:bg-green-500 dark:border-green-500 dark:hover:bg-green-600',
					'focus:ring-green-300 dark:focus:ring-green-800',
					primaryButton?.class
				)
			: (primaryButton?.class ?? '')
	);
</script>

<div
	class={cn(
		'flex flex-col items-center justify-center gap-6 py-16 px-8 text-center flex-1',
		customClass
	)}
>
	<div class={cn('rounded-full p-4', iconContainerClass)}>
		{#if variant === 'error'}
			<ServerCrash class={iconClass} />
		{:else if variant === 'information'}
			<Info class={iconClass} />
		{:else}
			<CheckCircle2 class={iconClass} />
		{/if}
	</div>

	<div class="flex flex-col items-center gap-2 max-w-md">
		{#if code}
			<span
				class="text-xs font-mono font-medium text-gray-400 dark:text-gray-500 tracking-wider uppercase"
			>
				{code}
			</span>
		{/if}

		{#if header}
			<h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
				{header}
			</h2>
		{/if}

		{#if description}
			<p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
				{description}
			</p>
		{/if}
	</div>

	{#if primaryButton || secondaryButton}
		<div class="flex items-center gap-3">
			{#if secondaryButton}
				<Button
					type="OUTLINED"
					variant="TEXT"
					disabled={secondaryButton.disabled}
					class={secondaryButton.class ?? ''}
					onClick={secondaryButton.onClick}
				>
					{secondaryButton.label}
				</Button>
			{/if}

			{#if primaryButton}
				<Button
					type="FILLED"
					variant={primaryButtonVariant}
					disabled={primaryButton.disabled}
					class={primaryButtonClass}
					onClick={primaryButton.onClick}
				>
					{primaryButton.label}
				</Button>
			{/if}
		</div>
	{/if}
</div>
