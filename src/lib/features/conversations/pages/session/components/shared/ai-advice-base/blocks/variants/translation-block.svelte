<script lang="ts">
	// TODO: ARCHITECTURAL COUPLING ISSUE - This shared block renderer imports a feature-specific utility.
	// This creates coupling between shared (ai-advice-base-v2) and feature-specific (ai-message-learning-tips) code.
	// REFACTOR NEEDED: Consider one of these approaches:
	//   1. Pass badge component as a prop/slot to translation-block
	//   2. Create a generic badge component that can handle both register badges and regular badges
	//   3. Evaluate if TipRegisterBadge should be moved to a truly shared location
	//   4. Use a factory/registry pattern for badge components
	import { Badge } from '$lib/components/utils/badge';
	import type { TranslationBlock } from '../../ai-advice.types';
	import type { TailwindColorTheme } from '$conversations/shared/utils/get-tailwind-colors';
	import TipRegisterBadge from '$conversations/pages/session/components/shared/ai-message-learning-tips/cards/shared/tip-register-badge.svelte';
	import { AuthUserNativeLanguageFlag } from '$auth/components';
	import { Languages } from 'lucide-svelte';

	interface Props {
		block: TranslationBlock;
		theme: TailwindColorTheme;
	}

	let { block }: Props = $props();
</script>

<div class="flex flex-col gap-0.5">
	<p class="analysis-card-label">{block.label || 'Translation'}</p>
	<div class="flex items-start gap-2">
		<p class="analysis-card-text min-w-0 flex-1">{block.translation.text}</p>

		{#if block.translation.badges.length > 0}
			<div class="flex flex-wrap justify-end gap-1">
				{#each block.translation.badges as badge (badge.text)}
					{#if badge.register}
						<TipRegisterBadge register={badge.register} color="gray" />
					{:else}
						<Badge color="gray" class="flex items-center gap-1">
							{#if badge.Icon}
								<badge.Icon class="h-3 w-3" />
							{/if}
							{badge.text}
						</Badge>
					{/if}
				{/each}
			</div>
		{/if}
	</div>

	{#if block.nativeLanguage?.text?.trim()}
		<div class="mt-0.5 flex items-center gap-1.5">
			<Languages class="h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden="true" />
			<AuthUserNativeLanguageFlag class="h-3 w-3 shrink-0" />
			<p class="analysis-card-text min-w-0">{block.nativeLanguage.text}</p>
		</div>
	{/if}
</div>
