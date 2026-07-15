<script lang="ts">
	import type { AiAdviceBaseBlock } from '../ai-advice.types';
	import type { TailwindColorTheme } from '$conversations/shared/utils/get-tailwind-colors';
	import { TextBlock, ExamplesBlock, BadgesBlock, TranslationBlock } from './variants';

	interface Props {
		block: AiAdviceBaseBlock;
		theme: TailwindColorTheme;
	}

	const { block, theme }: Props = $props();
</script>

{#if block.type === 'translation'}
	<TranslationBlock {block} {theme} />
{:else if block.type === 'text'}
	<TextBlock {block} {theme} />
{:else if block.type === 'examples'}
	<ExamplesBlock {block} {theme} />
{:else if block.type === 'badges'}
	<BadgesBlock {block} {theme} />
{/if}
