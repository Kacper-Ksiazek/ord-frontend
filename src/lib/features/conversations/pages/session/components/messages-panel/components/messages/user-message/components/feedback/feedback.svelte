<script lang="ts">
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { cn } from 'flowbite-svelte';
	import Score from './components/score.svelte';
	import { ChevronRightOutline } from 'flowbite-svelte-icons';

	interface FeedbackProps {
		feedback: ConversationUserMessageFeedbackDTO;
	}

	const { feedback }: FeedbackProps = $props();
</script>

<div class="flex gap-3 text-sm items-center">
	{#snippet scoreDivider()}
		<span class="text-sm text-gray-300">-</span>
	{/snippet}

	<Score field="Gramatyka" score={10} />
	{@render scoreDivider()}

	<Score field="Słownictwo" score={9} />
	{@render scoreDivider()}

	<Score field="Długość odpowiedzi" score={8} />
	{@render scoreDivider()}

	<Score field="Naturalność" score={7} />
</div>

<button
	class={cn(
		'bg-slate-100 text-sm px-3 py-1 rounded-md flex gap-2 items-center', //
		'hover:bg-slate-200'
	)}
>
	<span class="text-sm">Zobacz szczegóły</span>
	<ChevronRightOutline class="w-6 h-6" />
</button>
