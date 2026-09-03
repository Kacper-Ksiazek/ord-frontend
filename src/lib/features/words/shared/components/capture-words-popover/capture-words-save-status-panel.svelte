<script lang="ts">
	import { CircleCheck, ServerCrash } from 'lucide-svelte';
	import { introStagger } from '$lib/attachments';
	import { Button } from '$lib/components/buttons/button';
	import type { StatusButtonProps } from '$lib/components/utils/status-panel';
	import { cn } from '$lib/utils/cn';

	interface Props {
		variant: 'success' | 'error';
		header: string;
		description: string;
		primaryButton: StatusButtonProps;
		secondaryButton?: StatusButtonProps;
		class?: string;
	}

	const {
		variant,
		header,
		description,
		primaryButton,
		secondaryButton,
		class: customClass = ''
	}: Props = $props();

	const saveStatusIntro = introStagger({ startDelay: 0, interval: 0.08 });

	const iconContainerClass = $derived(variant === 'error' ? 'bg-danger/10' : 'bg-score-high-soft');
	const iconClass = $derived(
		variant === 'error' ? 'w-8 h-8 text-danger' : 'w-8 h-8 text-score-high'
	);
	const primaryButtonVariant = $derived(variant === 'error' ? 'DELETE' : 'PRIMARY');
	const primaryButtonClass = $derived(
		variant === 'success'
			? cn(
					'border-score-high bg-score-high hover:opacity-90',
					'focus:ring-score-high/30',
					primaryButton.class
				)
			: (primaryButton.class ?? '')
	);
</script>

<div
	{@attach saveStatusIntro}
	class={cn('flex flex-col items-center justify-center gap-6 py-10 px-4 text-center', customClass)}
>
	<div data-intro class={cn('rounded-full p-4', iconContainerClass)}>
		{#if variant === 'error'}
			<ServerCrash class={iconClass} />
		{:else}
			<CircleCheck class={iconClass} />
		{/if}
	</div>

	<h2 data-intro class="max-w-md text-xl font-semibold text-ink">
		{header}
	</h2>

	<p data-intro class="max-w-md text-sm leading-relaxed text-ink-muted">
		{description}
	</p>

	<div data-intro class="flex items-center gap-3">
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

		<Button
			type="FILLED"
			variant={primaryButtonVariant}
			disabled={primaryButton.disabled}
			class={primaryButtonClass}
			onClick={primaryButton.onClick}
		>
			{primaryButton.label}
		</Button>
	</div>
</div>

<style>
	@media (prefers-reduced-motion: no-preference) {
		[data-intro] {
			opacity: 0;
		}
	}
</style>
