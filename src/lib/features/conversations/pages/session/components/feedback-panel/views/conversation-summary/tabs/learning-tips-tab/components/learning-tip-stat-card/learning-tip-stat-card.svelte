<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { TabFilter } from '../../learning-tips-tab.types';
	import { getColors } from './learning-tip-stat-card.constants';
	import type { LearningTipStatCardProps } from './learning-tip-stat-card.constants.types';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$conversations/pages/session/consts/ai-message-learning-tips/icons';
	import { SigmaIcon } from 'lucide-svelte';

	let { count, tabId, isCardActive, onSelect }: LearningTipStatCardProps = $props();

	const isDisabled = $derived(count === 0);
	const colors = $derived(getColors(tabId, isCardActive));

	function handleClick() {
		if (isDisabled) return;
		onSelect(tabId);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (isDisabled) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onSelect(tabId);
		}
	}

	const { label, Icon } = (
		{
			ALL: {
				label: 'Total',
				Icon: SigmaIcon
			},
			GRAMMAR: {
				label: 'Grammar',
				Icon: AI_MESSAGE_LEARNING_TIP_ICONS_MAP.GRAMMAR
			},
			PHRASES: {
				label: 'Phrases',
				Icon: AI_MESSAGE_LEARNING_TIP_ICONS_MAP.PHRASES
			},
			VOCABULARY: {
				label: 'Vocabulary',
				Icon: AI_MESSAGE_LEARNING_TIP_ICONS_MAP.VOCABULARY
			}
		} satisfies Record<
			TabFilter,
			{
				label: string;
				Icon: LucideIcon;
			}
		>
	)[tabId];
</script>

<div
	role="button"
	tabindex={isDisabled ? -1 : 0}
	onclick={handleClick}
	onkeydown={handleKeydown}
	aria-disabled={isDisabled}
	class={cn(
		'p-4 rounded-lg flex-1 relative border transition-colors',
		'focus:outline-none focus:ring-2 focus:ring-offset-2',
		colors.bg,
		colors.border,
		isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
		!isCardActive && !isDisabled && 'hover:bg-gray-100 dark:hover:bg-gray-800/50',
		!isDisabled ? colors.focusRing : 'focus:ring-0'
	)}
>
	<div class={cn('text-sm', colors.text)}>{label}</div>
	<div class={cn('text-2xl font-bold', colors.valueText)}>{count}</div>

	<Icon class={cn('w-16 h-16 absolute bottom-0 right-0', colors.icon)} />
</div>
