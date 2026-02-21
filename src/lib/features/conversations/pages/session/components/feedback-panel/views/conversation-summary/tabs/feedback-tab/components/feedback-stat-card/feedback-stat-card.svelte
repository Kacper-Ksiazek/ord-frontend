<script lang="ts">
	import type { FeedbackTabFilter } from '../../feedback-tab.types';
	import type { FeedbackStatCardProps } from './feedback-stat-card.types';
	import { IconCard } from '$lib/components/cards/icon-card';
	import type { IconCardVariant } from '$lib/components/cards/icon-card';
	import { USER_MESSAGE_FEEDBACK_ICONS_MAP } from '$lib/features/conversations/pages/session/consts/user-message-feedback/icons';
	import { SigmaIcon } from 'lucide-svelte';

	let { count, tabId, isCardActive, onSelect }: FeedbackStatCardProps = $props();

	const isDisabled = $derived(count === 0);

	const { title, variant, Icon } = (
		{
			ALL: {
				title: 'Total',
				variant: 'primary',
				Icon: SigmaIcon
			},

			MISTAKES: {
				title: 'Mistakes',
				variant: 'red',
				Icon: USER_MESSAGE_FEEDBACK_ICONS_MAP.MISTAKES
			},

			STRENGTHS: {
				title: 'Strengths',
				variant: 'green',
				Icon: USER_MESSAGE_FEEDBACK_ICONS_MAP.STRENGTHS
			},

			SUGGESTIONS: {
				title: 'Suggestions',
				variant: 'blue',
				Icon: USER_MESSAGE_FEEDBACK_ICONS_MAP.SUGGESTIONS
			}
		} satisfies Record<
			FeedbackTabFilter,
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
