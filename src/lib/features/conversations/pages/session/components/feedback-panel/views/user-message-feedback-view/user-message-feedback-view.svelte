<script lang="ts">
	import { Badge } from 'flowbite-svelte';
	import { getSidepanelContext } from '../../../../contexts/sidepanel-context.svelte';
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';

	interface Props {
		feedback: ConversationUserMessageFeedbackDTO;
	}

	let { feedback }: Props = $props();

	const sidepanelContext = getSidepanelContext();
</script>

<div class="mb-6">
	<button class="text-muted-small mb-4" onclick={() => (sidepanelContext.isOpened = false)}>
		Back
	</button>

	<h2 class="heading-4 mb-4">Feedback Details</h2>

	<h3 class="heading-5 mb-2">TODOS</h3>
	<ul class="list-disc list-inside">
		<li>2 taby tutaj chce - ovierview i feedbacks ( wymyslec jakies nazwy )</li>
		<li>
			overview tab - ma miec wszystkie scory wraz z porownaniem do tego jak wyglada srednia ( do tej
			pory)
		</li>
		<li>
			overview tab - ma miec sama wiadomosc napisana wraz ze wskazaniem ilosci znakow oraz srednia
			ilosc znakow dla wiadomosci
		</li>
		<li>
			feedback tab - reuzyc komponentu do wyswietlania feedbackow z conversation summary / overview tab
		</li>
	</ul>

	<!-- Summary Section -->
	<div
		class="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
	>
		<div class="flex flex-wrap gap-2">
			{#if feedback.tutorComment}
				<Badge color="primary" large class="px-3 py-1.5 max-w-full">
					<span class="font-medium wrap-break-word">{feedback.tutorComment}</span>
				</Badge>
			{/if}
		</div>
	</div>
</div>
