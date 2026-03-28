<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { ExamplesBlock } from '../../ai-advice.types';
	import type { TailwindColorTheme } from '$lib/utils/theme/get-tailwind-colors';
	import { ArrowRight } from 'lucide-svelte';
	import { getAiMessageLearningTipColors } from '$conversations/pages/session/constants/ai-message-learning-tips/colors';

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

	function parseBoldText(text: string) {
		const parts: Array<{ text: string; bold: boolean }> = [];
		const regex = /\*\*(.*?)\*\*/g;
		let lastIndex = 0;
		let match;

		while ((match = regex.exec(text)) !== null) {
			if (match.index > lastIndex) {
				parts.push({ text: text.slice(lastIndex, match.index), bold: false });
			}
			parts.push({ text: match[1], bold: true });
			lastIndex = match.index + match[0].length;
		}

		if (lastIndex < text.length) {
			parts.push({ text: text.slice(lastIndex), bold: false });
		}

		return parts.length > 0 ? parts : [{ text, bold: false }];
	}
</script>

{#if block.examples && block.examples.length > 0}
	<div>
		<p class="analysis-card-label">{block.label}:</p>
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
