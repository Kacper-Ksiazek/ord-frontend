<script lang="ts">
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { cn } from 'flowbite-svelte';
	import Score from './components/score.svelte';
	import Metric from './components/metric.svelte';
	import { WandMagicSparklesOutline } from 'flowbite-svelte-icons';
	import { getSidepanelContext } from '$lib/features/conversations/pages/session/contexts/sidepanel-context.svelte';
	import ToggleSidepanelButton from './components/toggle-sidepanel-button.svelte';

	interface FeedbackProps {
		feedback: ConversationUserMessageFeedbackDTO;
	}

	const { feedback }: FeedbackProps = $props();

	const sidepanelContext = getSidepanelContext();

	const isSelected = $derived(
		sidepanelContext.isOpened && sidepanelContext.feedbackPreview?.id === feedback.id
	);

	const metrics = $derived.by(() => {
		return {
			mistakes: feedback.mistakes?.length || 0,
			strengths: feedback.strengthsIdentified?.length || 0,
			vocabularyEnrichment: feedback.vocabularyEnrichment?.length || 0,
			alternativeExpressions: feedback.alternativeExpressions?.length || 0,
			culturalNote: feedback.culturalNote ? 1 : 0
		};
	});
</script>

<div
	class={cn(
		'flex flex-col gap-2  px-4 py-2 rounded-md w-full relative transition-all',
		isSelected ? 'bg-primary-200 ml-2' : 'bg-primary-100 ml-10'
	)}
>
	<ToggleSidepanelButton {isSelected} {feedback} />

	<div class="flex text-primary-700">
		<WandMagicSparklesOutline />
		<span class="text-sm font-medium text-primary-700">Ocena AI</span>
	</div>

	<div class="flex gap-2 flex-wrap items-center">
		<Score field="Gramatyka" score={feedback.grammar} />

		<Score field="Słownictwo" score={feedback.vocabulary} />

		<Score field="Naturalność" score={feedback.naturalness} />

		<Score field="Długość" score={feedback.answerLength} />
	</div>

	<p class="text-gray-600 dark:text-gray-400 leading-[1.8] tracking-wide">
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
		nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
		esse cillum dolore eu fugiat nulla pariatur.
	</p>

	<div class="flex gap-2 flex-wrap items-center">
		<p class="font-bold text-gray-600 dark:text-gray-400 leading-[1.8] tracking-wide">
			Informacje zwrotne:
		</p>

		<Metric criteria="MISTAKES" count={metrics.mistakes} label="Błędy" />
		<Metric criteria="STRENGTHS" count={metrics.strengths} label="Mocne strony" />
		<Metric
			criteria="VOCABULARY_ENRICHMENT"
			count={metrics.vocabularyEnrichment}
			label="Słownictwo"
		/>
		<Metric
			criteria="ALTERNATIVE_EXPRESSIONS"
			count={metrics.alternativeExpressions}
			label="Alternatywy"
		/>
		<Metric criteria="CULTURAL_NOTE" count={metrics.culturalNote} label="Uwaga kulturowa" />
	</div>
</div>
