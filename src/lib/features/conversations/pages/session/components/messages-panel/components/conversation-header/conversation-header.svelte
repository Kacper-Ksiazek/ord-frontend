<script lang="ts">
	import { getConversationContext } from '$lib/features/conversations/pages/session/contexts/conversation-context.svelte';
	import { formatDateDayMonthYearTime } from '$lib/utils/format-date-day-month-year-time';

	import { InterlocutorDetails } from './components';

	const conversation = getConversationContext();
</script>

<div class="flex flex-col items-center gap-6 text-center">
	<InterlocutorDetails />

	<div class="flex w-full max-w-lg flex-col gap-1 px-2">
		<p class="text-[16px] font-medium leading-snug text-gray-600 dark:text-gray-400">
			{conversation.topic}
		</p>
		<time
			class="text-[14px] tabular-nums text-gray-500 dark:text-gray-400"
			datetime={conversation.createdAt}
		>
			{formatDateDayMonthYearTime(conversation.createdAt)}
		</time>
	</div>
</div>
