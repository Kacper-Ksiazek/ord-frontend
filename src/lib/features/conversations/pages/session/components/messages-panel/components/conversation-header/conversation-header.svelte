<script lang="ts">
	import { getConversationContext } from '$conversations/pages/session/contexts/conversation-context.svelte';
	import { getConversationTypeLabel, getConversationToneLabel } from '$conversations/shared/utils';
	import { formatDateDayMonthYearTime } from '$lib/utils/format-date-day-month-year-time';
	import { Badge } from '$lib/components/utils/badge';

	import { InterlocutorDetails } from './components';

	const conversation = getConversationContext();
</script>

<div class="w-full overflow-hidden rounded-[10px] border border-line bg-surface text-ink">
	<div class="flex items-start gap-4 px-4 py-3">
		<InterlocutorDetails />

		<div class="min-w-0 flex-1">
			<div class="flex flex-wrap items-center gap-x-2 gap-y-1">
				<span class="text-sm font-medium text-ink">{conversation.interlocutor.name}</span>
				<span class="text-xs text-ink-subtle" aria-hidden="true">·</span>
				<time class="text-xs text-ink-muted" datetime={conversation.createdAt}>
					{formatDateDayMonthYearTime(conversation.createdAt)}
				</time>
			</div>

			<p class="mt-1 text-sm leading-relaxed text-ink">
				{conversation.topic}
			</p>

			<div class="mt-2 flex flex-wrap items-center gap-2" aria-label="Conversation settings">
				<Badge color="gray">{conversation.proficiencyLevel}</Badge>
				<Badge color="gray">{getConversationTypeLabel(conversation.type)}</Badge>
				<Badge color="gray">{getConversationToneLabel(conversation.aiTone)}</Badge>
			</div>
		</div>
	</div>
</div>
