<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { TextBlock } from '../../ai-advice.types';
	import {
		getTailwindColorTheme,
		type TailwindColorTheme
	} from '$conversations/shared/utils/get-tailwind-colors';

	interface Props {
		block: TextBlock;
		theme: TailwindColorTheme;
	}

	let { block }: Props = $props();

	const highlightSwatch = $derived(
		block.variant ? getTailwindColorTheme(block.variant).highlightSwatch : undefined
	);
</script>

<div class="flex flex-col gap-0.5">
	<p class="analysis-card-label">{block.label}</p>
	<p class="analysis-card-text flex items-center gap-1.5">
		{#if block.Icon}
			<span
				class={cn('flex size-5 shrink-0 items-center justify-center rounded-md', block.iconBgClass)}
			>
				<block.Icon class={cn('size-3.5', block.iconClass)} aria-hidden="true" />
			</span>
		{:else if highlightSwatch}
			<span class={cn('size-2 shrink-0 rounded-full', highlightSwatch)} aria-hidden="true"></span>
		{/if}
		<span class="min-w-0">{block.text}</span>
	</p>
</div>
