<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { TabFilter } from '../../learning-tips-tab.types';
	import type { LearningTipStatCardProps } from './learning-tip-stat-card.constants.types';
	import { IconCard } from '$lib/components/cards/icon-card';
	import type { IconCardVariant } from '$lib/components/cards/icon-card';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$conversations/pages/session/consts/ai-message-learning-tips/icons';
	import { SigmaIcon } from 'lucide-svelte';

	let { count, tabId, isCardActive, onSelect }: LearningTipStatCardProps = $props();

	const isDisabled = $derived(count === 0);

	const { title, variant, Icon } = (
		{
			ALL: {
				title: 'Total',
				variant: 'primary',
				Icon: SigmaIcon
			},
			GRAMMAR: {
				title: 'Grammar',
				variant: 'green',
				Icon: AI_MESSAGE_LEARNING_TIP_ICONS_MAP.GRAMMAR
			},
			PHRASES: {
				title: 'Phrases',
				variant: 'purple',
				Icon: AI_MESSAGE_LEARNING_TIP_ICONS_MAP.PHRASES
			},
			VOCABULARY: {
				title: 'Vocabulary',
				variant: 'blue',
				Icon: AI_MESSAGE_LEARNING_TIP_ICONS_MAP.VOCABULARY
			}
		} satisfies Record<
			TabFilter,
			{
				title: string;
				Icon: LucideIcon;
				variant: IconCardVariant;
			}
		>
	)[tabId];
</script>

<IconCard
	{title}
	value={count}
	{variant}
	isActive={isCardActive}
	disabled={isDisabled}
	onclick={() => onSelect(tabId)}
>
	{#snippet icon({ className })}
		<Icon class={className} />
	{/snippet}
</IconCard>
