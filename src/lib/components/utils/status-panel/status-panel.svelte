<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { ServerCrash, Info, CircleCheck } from 'lucide-svelte';
	import { Button } from '$lib/components/buttons/button';
	import type { StatusButtonProps, StatusPanelVariant } from './status-panel.types';

	interface Props {
		variant?: StatusPanelVariant;
		header?: string;
		code?: string | number;
		description?: string;
		/** Merged onto the description paragraph (e.g. `content-long`). */
		descriptionClass?: string;
		primaryButton?: StatusButtonProps;
		secondaryButton?: StatusButtonProps;
		class?: string;
	}

	const {
		variant = 'error',
		header,
		code,
		description,
		descriptionClass = '',
		primaryButton,
		secondaryButton,
		class: customClass = ''
	}: Props = $props();

	const iconContainerClass = $derived(
		variant === 'error'
			? 'bg-danger/10'
			: variant === 'information'
				? 'bg-accent-soft'
				: 'bg-score-high-soft'
	);

	const iconClass = $derived(
		variant === 'error'
			? 'w-8 h-8 text-danger'
			: variant === 'information'
				? 'w-8 h-8 text-ink-muted'
				: 'w-8 h-8 text-score-high'
	);

	// Primary button uses FILLED with a variant-matched color.
	// 'success' has no native green ButtonVariant, so we override via class.
	const primaryButtonVariant = $derived(variant === 'error' ? 'DELETE' : 'PRIMARY');

	const primaryButtonClass = $derived(
		variant === 'success'
			? cn(
					'border-score-high bg-score-high hover:opacity-90',
					'focus:ring-score-high/30',
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
			<CircleCheck class={iconClass} />
		{/if}
	</div>

	<div class="flex flex-col items-center gap-2 max-w-md">
		{#if code}
			<span class="text-xs font-mono font-medium tracking-wider text-ink-subtle uppercase">
				{code}
			</span>
		{/if}

		{#if header}
			<h2 class="text-xl font-semibold text-ink">
				{header}
			</h2>
		{/if}

		{#if description}
			<p class={cn('text-sm leading-relaxed text-ink-muted', descriptionClass)}>
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
