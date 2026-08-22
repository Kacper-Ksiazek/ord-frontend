<script lang="ts">
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

	const icon = $derived(block.Icon ?? ArrowRight);

	const highlightStyle = $derived.by(() => {
		if (block.category && block.parseBold) {
			return getAiMessageLearningTipColors(block.category).highlightedText;
		}

		return theme.highlightedText;
	});
</script>

{#if block.examples && block.examples.length > 0}
	<div class="flex flex-col gap-1">
		<p class="analysis-card-label">{block.label}</p>
		<div class="flex flex-col gap-1">
			{#each block.examples as example (example)}
				{@const Icon = icon}
				<div class="flex items-center gap-1.5">
					<Icon class="h-3.5 w-3.5 shrink-0 text-ink-muted" />

					<p class="analysis-card-text">
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
					</p>
				</div>
			{/each}
		</div>
	</div>
{/if}
