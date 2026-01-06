<script lang="ts">
	import type { AIMessageLearningTips } from '$lib/types/ongoing-conversation/api/responses';
	import size from 'lodash/size';
	import AiPostProcessActionBase from '../../../ai-post-process-action-base.svelte';

	interface LearningTipsProps {
		learningTips: AIMessageLearningTips;
	}

	const { learningTips }: LearningTipsProps = $props();

	const hasGrammarTips = size(learningTips.grammarTips) > 0;
	const hasVocabularyTips = size(learningTips.vocabularyTips) > 0;
	const hasIdiomTips = size(learningTips.idiomTips) > 0;

	const hasTips = hasGrammarTips || hasVocabularyTips || hasIdiomTips;
</script>

{#if hasTips}
	<AiPostProcessActionBase
		label="Wskazówki do nauki"
		onclick={() => {
			alert('clicked');
		}}
	>
		<span>TODO: chips & toggle</span>
	</AiPostProcessActionBase>
{/if}
