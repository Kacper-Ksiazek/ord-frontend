<script lang="ts">
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { cn } from 'flowbite-svelte';
	import Score from './components/score.svelte';
	import { Sparkles } from 'lucide-svelte';
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

	let showMore = $state(true);
</script>

<div
	class={cn(
		'flex flex-col gap-2  px-4 py-2 rounded-md w-full relative transition-all',
		isSelected ? 'bg-primary-200' : 'bg-primary-100 ml-8'
	)}
>
	<div class="flex text-primary-700">
		<Sparkles />
		<span class="font-medium text-primary-700">Ocena AI</span>
	</div>

	<div class="flex gap-2 flex-wrap items-center">
		<Score field="Gramatyka" score={feedback.grammar} />

		<Score field="Słownictwo" score={feedback.vocabulary} />

		<Score field="Naturalność" score={feedback.naturalness} />

		<Score field="Długość" score={feedback.answerLength} />
	</div>

	{#if showMore}
		<p class="text-xs font-semibold text-primary-700 dark:text-gray-300 uppercase tracking-wide mt-1">
			PODSUMOWANIE
		</p>

		<div class="p-2 bg-white rounded-md">
			<p class="text-gray-900 dark:text-gray-100 leading-[1.8] tracking-wide">
				{feedback.tutorComment}
			</p>
		</div>
	{/if}

	<ToggleSidepanelButton {isSelected} {feedback} />
</div>
