<script lang="ts">
	import { getConversationContext } from '$conversations/pages/session/contexts/conversation-context.svelte';
	import { getConversationTypeLabel, getConversationToneLabel } from '$conversations/shared/utils';
	import { formatDateDayMonthYearTime } from '$lib/utils/format-date-day-month-year-time';
	import { cn } from 'flowbite-svelte';

	import { InterlocutorDetails } from './components';

	const conversation = getConversationContext();

	const chipClass = cn(
		'label-small shrink-0 whitespace-nowrap rounded-md px-2.5 py-1',
		'border',
		'bg-white text-gray-900 border-gray-300',
		'dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600'
	);
</script>

<div class="flex flex-col items-center gap-6 text-center">
	<InterlocutorDetails />

	<div class="flex w-full max-w-lg flex-col gap-3 px-2">
		<p class="text-[16px] font-medium leading-snug text-gray-600 dark:text-gray-400">
			{conversation.topic}
		</p>

		<div class="flex flex-wrap items-center justify-center gap-2" aria-label="Conversation settings">
			<span class={chipClass}>{conversation.proficiencyLevel}</span>
			<span class={chipClass}>{getConversationTypeLabel(conversation.type)}</span>
			<span class={chipClass}>{getConversationToneLabel(conversation.aiTone)}</span>
		</div>

		<time class="text-[14px] text-gray-500 dark:text-gray-400" datetime={conversation.createdAt}>
			{formatDateDayMonthYearTime(conversation.createdAt)}
		</time>
	</div>
</div>
