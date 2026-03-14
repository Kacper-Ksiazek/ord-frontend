<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { TextBlock } from '../../ai-advice.types';
	import type { TailwindColorTheme } from '$lib/utils/theme/get-tailwind-colors';

	interface Props {
		block: TextBlock;
		theme: TailwindColorTheme;
	}

	let { block, theme }: Props = $props();

	const variantClass = $derived.by(() => {
		if (block.variant) {
			return `variant-${block.variant}`;
		}

		return 'variant-neutral';
	});

	const iconColor = $derived.by(() => {
		if (block.variant === 'green') {
			return 'text-green-500 dark:text-green-400';
		}

		return theme.iconColor;
	});
</script>

<div class="feedback-card-section">
	<p class="feedback-card-label">{block.label}:</p>
	<div class={cn('feedback-card-text-box', variantClass)}>
		{#if block.Icon}
			<block.Icon class={cn('w-4 h-4', iconColor)} />
		{/if}

		<span class="content-long-sm">{block.text}</span>
	</div>
</div>
