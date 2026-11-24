<script lang="ts">
	import { Check, type Icon, Info, ServerCrash } from 'lucide-svelte';
	import { introStagger } from '$lib/attachments';
	import { Button } from '$lib/components/buttons/button';
	import { cn } from '$lib/utils/cn';
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
		/** Staggered fade-in of icon, copy and actions (e.g. inside popovers). */
		animateIn?: boolean;
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
		animateIn = false,
		class: customClass = ''
	}: Props = $props();

	interface VariantTone {
		icon: typeof Icon;
		/** Quiet tinted tile behind the icon: 10% fill plus a hairline ring */
		tile: string;
		iconColor: string;
	}

	const tones: Record<StatusPanelVariant, VariantTone> = {
		error: {
			icon: ServerCrash,
			tile: 'bg-danger/10 ring-danger/20',
			iconColor: 'text-danger'
		},
		information: {
			icon: Info,
			tile: 'bg-accent-soft ring-line',
			iconColor: 'text-ink-muted'
		},
		success: {
			icon: Check,
			tile: 'bg-score-high/10 ring-score-high/25',
			iconColor: 'text-score-high'
		}
	};

	const tone = $derived(tones[variant]);
	const intro = $derived(animateIn ? introStagger({ startDelay: 0, interval: 0.08 }) : undefined);
	const introAttr = $derived(animateIn ? '' : undefined);
</script>

<div
	{@attach intro}
	class={cn('flex flex-1 flex-col items-center justify-center px-8 py-14 text-center', customClass)}
>
	<div
		data-intro={introAttr}
		class={cn('mb-5 grid size-12 place-items-center rounded-xl ring-1 ring-inset', tone.tile)}
	>
		<tone.icon class={cn('size-5', tone.iconColor)} strokeWidth={2.25} />
	</div>

	<div data-intro={introAttr} class="flex max-w-sm flex-col items-center">
		{#if code}
			<span class="mb-1.5 text-xs font-[650] tracking-[0.04em] text-ink-subtle uppercase">
				{code}
			</span>
		{/if}

		{#if header}
			<h2 class="text-lg font-semibold tracking-[-0.02em] text-ink">
				{header}
			</h2>
		{/if}

		{#if description}
			<p class={cn('mt-1.5 text-sm leading-relaxed text-ink-muted', descriptionClass)}>
				{description}
			</p>
		{/if}
	</div>

	{#if primaryButton || secondaryButton}
		<div data-intro={introAttr} class="mt-6 flex items-center gap-2">
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
					variant="PRIMARY"
					disabled={primaryButton.disabled}
					class={primaryButton.class ?? ''}
					onClick={primaryButton.onClick}
				>
					{primaryButton.label}
				</Button>
			{/if}
		</div>
	{/if}
</div>

<style>
	@media (prefers-reduced-motion: no-preference) {
		[data-intro] {
			opacity: 0;
		}
	}
</style>
