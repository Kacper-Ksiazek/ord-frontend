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
	<p class="analysis-card-text">
		{#if highlightSwatch}
			<span
				class={cn(
					'mr-1.5 mb-px inline-block h-2 w-2 shrink-0 rounded-full align-middle',
					highlightSwatch
				)}
				aria-hidden="true"
			></span>
		{/if}{block.text}
	</p>
</div>
