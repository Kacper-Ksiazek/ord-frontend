<script lang="ts">
	import { Check, X } from 'lucide-svelte';
	import { StreamingCaret } from '$lib/components/utils/ai-text-skeleton';
	import type { CommonMistake } from '$aiExplainer/shared/utils/parse-follow-up-sections';
	import EmphasizedText from './emphasized-text.svelte';

	interface Props {
		items: CommonMistake[];
		isStreaming: boolean;
	}

	let { items, isStreaming }: Props = $props();
</script>

<ul class="flex flex-col gap-3">
	{#each items as item, index (index)}
		<li class="flex flex-col gap-2 rounded-xl border border-line-subtle bg-canvas/40 px-4 py-3">
			{#if item.wrong}
				<p class="flex items-start gap-2.5 text-ink-muted">
					<X class="mt-1 size-4 shrink-0 text-danger" aria-hidden="true" />
					<span class="message-body min-w-0 text-base"><EmphasizedText content={item.wrong} /></span>
				</p>
			{/if}
			{#if item.right}
				<p class="flex items-start gap-2.5 text-ink">
					<Check
						class="mt-1 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
						aria-hidden="true"
					/>
					<span class="message-body min-w-0 text-base">
						<EmphasizedText
							content={item.right}
						/>{#if isStreaming && index === items.length - 1 && !item.why}<StreamingCaret />{/if}
					</span>
				</p>
			{/if}
			{#if item.why}
				<p class="pl-[1.625rem] text-sm leading-relaxed text-ink-muted">
					{item.why}{#if isStreaming && index === items.length - 1}<StreamingCaret />{/if}
				</p>
			{/if}
		</li>
	{/each}
</ul>
