<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '../../../constants/ai-message-learning-tips/icons';
	import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
	import { getAiMessageLearningTipColors } from '../../../constants/ai-message-learning-tips/colors';

	interface Props {
		tipCategory: LearningTipCategory;
		class?: string;
	}

	const { tipCategory, class: className }: Props = $props();

	const Icon = $derived(AI_MESSAGE_LEARNING_TIP_ICONS_MAP[tipCategory]);
</script>

<Icon
	class={cn(
		getAiMessageLearningTipColors(tipCategory).twColor, //
		className
	)}
/>
