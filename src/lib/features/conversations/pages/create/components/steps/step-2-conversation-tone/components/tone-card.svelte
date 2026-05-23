<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { Heart } from 'lucide-svelte';
	import { IconButton } from '$lib/components/actions/icon-button';
	import { SelectableCard } from '$lib/components/surfaces/selectable-card';
	import * as m from '$lib/paraglide/messages.js';
	import type { ConversationAITone } from '$lib/types/conversation/domain/conversation';
	import ConversationToneIcon from '$lib/features/conversations/shared/components/conversation-tone-icon.svelte';

	type ToneCardProps = {
		isSelected: boolean;
		isPreferredDefault?: boolean;
		onToggleDefault?: () => void;
		tone: ConversationAITone;
		label: string;
		description: string;
		onclick: () => void;
	};

	const {
		onclick,
		isSelected,
		isPreferredDefault = false,
		onToggleDefault,
		tone,
		label,
		description
	}: ToneCardProps = $props();

	const enableHints = true;
</script>

<SelectableCard {onclick} {isSelected} class={cn('relative w-[378px] py-10 px-4')}>
	{#if onToggleDefault}
		<IconButton
			icon={Heart}
			ariaLabel={isPreferredDefault
				? m['features.conversation.create.step-2.default_tone_star_aria_label_remove']()
				: m['features.conversation.create.step-2.default_tone_star_aria_label']()}
			tooltip={isPreferredDefault
				? m['features.conversation.create.step-2.default_tone_star_tooltip_remove']()
				: m['features.conversation.create.step-2.default_tone_star_tooltip']()}
			type="OUTLINED"
			variant="TEXT"
			class="absolute right-3 top-3 z-10 size-8 shrink-0 p-0"
			iconClass={cn(
				'size-4',
				isPreferredDefault && 'fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400'
			)}
			onClick={(e) => {
				e.stopPropagation();
				onToggleDefault();
			}}
		/>
	{/if}

	<ConversationToneIcon
		{tone}
		class={cn(
			'w-20 h-20 text-gray-300 mb-2 dark:text-gray-600',
			isSelected && 'text-primary-500 dark:text-white'
		)}
	/>

	<h3 class="text-lg font-bold text-gray-900 dark:text-gray-50">
		{label}
	</h3>

	{#if enableHints}
		<p
			class={cn(
				'text-sm text-center dark:text-gray-400',
				isSelected && 'text-gray-600 dark:text-gray-100'
			)}
		>
			{description}
		</p>
	{/if}
</SelectableCard>
