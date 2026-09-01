<script lang="ts">
	import { Badge } from '$lib/components/utils/badge';
	import { MistakeSeverityIndicator } from '$conversations/shared/components/mistake-severity-indicator';
	import type { TailwindColorTheme } from '$conversations/shared/utils/get-tailwind-colors';
	import type { BadgesBlock } from '../../ai-advice.types';

	interface Props {
		block: BadgesBlock;
		theme: TailwindColorTheme;
	}

	let { block }: Props = $props();
</script>

<div class="flex items-center justify-between gap-3">
	{#if block.severity}
		<MistakeSeverityIndicator severity={block.severity.value} layout="inline" class="shrink-0" />
	{/if}

	<div class="flex flex-1 flex-wrap justify-end gap-1">
		{#each block.badges as badge (badge.text)}
			<Badge color="gray" class="flex items-center gap-1">
				{#if badge.Icon}
					<badge.Icon class="h-3 w-3" />
				{/if}
				{badge.text}
			</Badge>
		{/each}
	</div>
</div>
