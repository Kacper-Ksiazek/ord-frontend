<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { ExamplesBlock } from '../../ai-advice.types';
	import type { TailwindColorTheme } from '$conversations/shared/utils/get-tailwind-colors';
	import { ArrowRight } from 'lucide-svelte';
	import { getAiMessageLearningTipColors } from '$conversations/pages/session/constants/ai-message-learning-tips/colors';
	import { parseBoldText } from '$lib/utils/text/parse-bold-text';

	interface Props {
		block: ExamplesBlock;
		theme: TailwindColorTheme;
	}

	let { block, theme }: Props = $props();

	const defaultIcon = ArrowRight;
	const icon = $derived.by(() => block.Icon || defaultIcon);

	const highlightStyle = $derived.by(() => {
		if (block.category && block.parseBold) {
			return getAiMessageLearningTipColors(block.category).highlightedText;
		}

		return theme.highlightedText;
	});
</script>

{#if block.examples && block.examples.length > 0}
	<div>
		<p class="label mb-1">{block.label}:</p>
		<div class="space-y-2">
			{#each block.examples as example (example)}
				{@const Icon = icon}
				<div class="analysis-card-text-box variant-neutral">
					<Icon class={cn('w-4 h-4', theme.iconColor)} />

					<span class="content-long">
						{#if block.parseBold}
							{#each parseBoldText(example) as part (part.text)}
								{#if part.bold}
									<span class={highlightStyle}>{part.text}</span>
								{:else}
									{part.text}
								{/if}
							{/each}
						{:else}
							{example}
						{/if}
					</span>
				</div>
			{/each}
		</div>
	</div>
{/if}
