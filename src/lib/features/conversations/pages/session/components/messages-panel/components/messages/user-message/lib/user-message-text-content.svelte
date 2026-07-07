<script lang="ts">
	import { highlightAnalysisContent } from '../utils/highlight-analysis';
	import AnalysisTextHighlight from '../components/analysis-text-highlight/analysis-text-highlight.svelte';
	import isNil from 'lodash/isNil';
	import type { ConversationUserMessageAnalysisDTO } from '$conversations/types/domain/conversation-message-analysis';

	interface UserMessageProps {
		messageIndex: number;
		messageContent: string;
		analysis: ConversationUserMessageAnalysisDTO | null;
		disableHoverHighlight?: boolean;
		showIconsInHighlightedParts?: boolean;
	}

	let {
		messageIndex,
		messageContent,
		analysis,
		disableHoverHighlight = false,
		showIconsInHighlightedParts = false
	}: UserMessageProps = $props();

	const highlightedParts = $derived.by(() => {
		if (isNil(analysis)) {
			return null;
		}

		return highlightAnalysisContent(messageContent, analysis);
	});
</script>

<p>
	{#if highlightedParts && analysis}
		{#each highlightedParts as part, index (index)}
			{#if part.highlight}
				{@const id = `highlight-${messageIndex}-${part.highlight}-${index}`}

				<AnalysisTextHighlight
					{id}
					highlightType={part.highlight}
					highlightedText={part.text}
					{disableHoverHighlight}
					{analysis}
					{showIconsInHighlightedParts}
				/>
			{:else}
				{part.text}
			{/if}
		{/each}
	{:else}
		{messageContent}
	{/if}
</p>
