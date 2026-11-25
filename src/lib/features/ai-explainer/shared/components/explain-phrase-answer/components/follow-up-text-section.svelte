<script lang="ts">
	import { fade } from 'svelte/transition';
	import { StreamingCaret } from '$lib/components/utils/ai-text-skeleton';
	import {
		parseCommonMistakes,
		parseUsedWith
	} from '$aiExplainer/shared/utils/parse-follow-up-sections';
	import type { ExplainPhraseFollowUpAction } from '$aiExplainer/types';
	import CommonMistakesList from './common-mistakes-list.svelte';
	import EmphasizedText from './emphasized-text.svelte';
	import UsedWithList from './used-with-list.svelte';

	interface Props {
		action: ExplainPhraseFollowUpAction;
		label: string;
		text: string;
		isStreaming: boolean;
	}

	let { action, label, text, isStreaming }: Props = $props();

	/** Structured layouts when the text is in the expected format; anything else stays plain text. */
	const mistakes = $derived(action === 'COMMON_MISTAKES' ? parseCommonMistakes(text) : null);
	const usedWith = $derived(action === 'USED_WITH' ? parseUsedWith(text) : []);
</script>

<section class="flex flex-col gap-2.5" in:fade={{ duration: 200 }}>
	<p class="text-xs font-semibold tracking-wide text-ink-subtle uppercase">{label}</p>
	{#if mistakes}
		<CommonMistakesList items={mistakes} {isStreaming} />
	{:else if usedWith.length > 0}
		<UsedWithList items={usedWith} {isStreaming} />
	{:else}
		<p class="message-body text-base whitespace-pre-wrap text-ink" aria-live="polite">
			<EmphasizedText content={text} />{#if isStreaming}<StreamingCaret />{/if}
		</p>
	{/if}
</section>
