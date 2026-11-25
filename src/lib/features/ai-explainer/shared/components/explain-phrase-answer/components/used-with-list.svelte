<script lang="ts">
	import { StreamingCaret } from '$lib/components/utils/ai-text-skeleton';
	import type { UsedWithItem } from '$aiExplainer/shared/utils/parse-follow-up-sections';

	interface Props {
		items: UsedWithItem[];
		isStreaming: boolean;
	}

	let { items, isStreaming }: Props = $props();
</script>

<ul class="flex flex-col divide-y divide-line-subtle">
	{#each items as item, index (index)}
		<li
			class="flex flex-col gap-0.5 py-2 first:pt-0 last:pb-0 sm:grid sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-x-6"
		>
			<span class="font-medium text-ink">{item.term}</span>
			<span class="text-sm leading-relaxed text-ink-muted sm:text-base">
				{item.note}{#if isStreaming && index === items.length - 1}<StreamingCaret />{/if}
			</span>
		</li>
	{/each}
</ul>
