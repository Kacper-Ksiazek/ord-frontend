<script lang="ts">
	// TODO: ARCHITECTURAL COUPLING ISSUE - This shared block renderer imports a feature-specific utility.
	// This creates coupling between shared (ai-advice-base-v2) and feature-specific (ai-message-learning-tips) code.
	// REFACTOR NEEDED: Consider one of these approaches:
	//   1. Pass badge component as a prop/slot to translation-block
	//   2. Create a generic badge component that can handle both register badges and regular badges
	//   3. Evaluate if TipRegisterBadge should be moved to a truly shared location
	//   4. Use a factory/registry pattern for badge components
	import { Badge, cn } from 'flowbite-svelte';
	import type { TranslationBlock } from '../../ai-advice.types';
	import type { TailwindColorTheme } from '$lib/utils/theme/get-tailwind-colors';
	import TipRegisterBadge from '$conversations/pages/session/components/shared/ai-message-learning-tips/cards/shared/tip-register-badge.svelte';
	import AuthUserNativeLanguageFlag from '$lib/components/auth-user-native-language-flag.svelte';

	interface Props {
		block: TranslationBlock;
		theme: TailwindColorTheme;
	}

	let { block, theme }: Props = $props();

	const variantClass = $derived.by(() => {
		switch (theme.twColor) {
			case 'green':
				return 'variant-green';
			case 'blue':
				return 'variant-blue';
			case 'purple':
				return 'variant-purple';
			case 'red':
				return 'variant-red';
			default:
				return 'variant-neutral';
		}
	});
</script>

<div class="feedback-card-section">
	<p class="feedback-card-label">{block.label || 'Translation'}:</p>
	<div class={cn('feedback-card-text-box', variantClass, 'flex gap-2')}>
		<block.translation.Icon class={cn('w-4 h-4', theme.iconColor)} />
		<span class="flex-1 content-long-sm">{block.translation.text}</span>

		{#each block.translation.badges as badge (badge.text)}
			{#if badge.register}
				<TipRegisterBadge register={badge.register} color={theme.twColor} />
			{:else}
				<Badge color={theme.twColor} class="flex items-center gap-1">
					{#if badge.Icon}
						<badge.Icon class="w-4 h-4" />
					{/if}
					{badge.text}
				</Badge>
			{/if}
		{/each}
	</div>

	{#if block.nativeLanguage}
		<div class="feedback-card-text-box variant-neutral flex gap-2 mt-1">
			<AuthUserNativeLanguageFlag class="w-4 h-4" />
			<span class="flex-1 content-long-sm">{block.nativeLanguage.text}</span>
		</div>
	{/if}
</div>
