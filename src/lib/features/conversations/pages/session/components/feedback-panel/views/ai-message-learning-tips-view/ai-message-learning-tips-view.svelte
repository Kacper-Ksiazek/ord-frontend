<script lang="ts">
	import { getSidepanelContext } from '../../../../contexts/sidepanel-context.svelte';
	import { getMessagesContext } from '../../../../contexts/messages-context.svelte';
	import LearningTipsListWithFilters from '../../components/learning-tips-list-with-filters/learning-tips-list-with-filters.svelte';
	import { TextDotsAnimation as TextWithThreeDotsAnimation } from '$lib/components/feedback/text-dots-animation';
	import type { CompactConversationAiMessage } from '$lib/types/conversation/domain/conversation-message';

	const sidepanelContext = getSidepanelContext();
	const messagesContext = getMessagesContext();

	const messages = $derived(messagesContext.messages);
	const order = $derived(sidepanelContext.learningTipsPreviewMessageOrder);

	const currentMessage = $derived.by((): CompactConversationAiMessage | null => {
		if (order === null) return null;
		const msg = messages[order];
		if (!msg || msg.sender !== 'AI') return null;

		return msg;
	});
</script>

{#if currentMessage}
	<div class="flex flex-col h-full min-h-0">
		<div class="shrink-0 space-y-6">
			<h2 class="heading-4 mb-4">Wskazówki do nauki</h2>
		</div>

		<div class="flex-1 min-h-0 flex flex-col">
			{#if !currentMessage.learningTips}
				<TextWithThreeDotsAnimation
					text="Trwa przygotowywanie materiałów edukacyjnych"
					dotsWrapperClass="mb-1"
				/>
			{:else}
				<LearningTipsListWithFilters data={currentMessage} />
			{/if}
		</div>
	</div>
{:else if order !== null}
	<p class="content-long text-gray-500 dark:text-gray-400">
		Nie można załadować wskazówek dla tej wiadomości.
	</p>
{/if}
