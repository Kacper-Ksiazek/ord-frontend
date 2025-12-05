<script lang="ts">
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { cn } from 'flowbite-svelte';
	import Score from './components/score.svelte';
	import { ChevronRightOutline } from 'flowbite-svelte-icons';
	import { getSidepanelContext } from '../../../../../../../contexts/sidepanel-context.svelte';

	interface FeedbackProps {
		feedback: ConversationUserMessageFeedbackDTO;
	}

	const { feedback }: FeedbackProps = $props();

	const sidepanelContext = getSidepanelContext();

	const isSelected = $derived(
		sidepanelContext.isOpened && sidepanelContext.feedbackPreview === feedback
	);

	function handleClick() {
		sidepanelContext.isOpened = true;
		sidepanelContext.feedbackPreview = feedback;
	}
</script>

<div class="flex gap-3 text-sm items-center">
	{#snippet scoreDivider()}
		<span class="text-sm text-gray-300">-</span>
	{/snippet}

	<Score field="Gramatyka" score={feedback.grammar} />
	{@render scoreDivider()}

	<Score field="Słownictwo" score={feedback.vocabulary} />
	{@render scoreDivider()}

	<Score field="Długość odpowiedzi" score={feedback.answerLength} />
	{@render scoreDivider()}

	<Score field="Naturalność" score={feedback.naturalness} />
</div>

<button
	class={cn(
		'text-sm px-3 py-1 rounded-md flex gap-2 items-center transition-colors',
		isSelected
			? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-2 border-primary-300 dark:border-primary-700'
			: 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
	)}
	onclick={handleClick}
>
	<span class="text-sm">Zobacz szczegóły</span>
	<ChevronRightOutline class="w-6 h-6" />
</button>
