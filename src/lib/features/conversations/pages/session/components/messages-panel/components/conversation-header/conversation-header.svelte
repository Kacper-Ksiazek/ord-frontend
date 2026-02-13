<script lang="ts">
	import { getConversationContext } from '$lib/features/conversations/pages/session/contexts/conversation-context.svelte';
	import ConversationToneIcon from '$lib/features/conversations/shared/components/conversation-tone-icon.svelte';
	import {
		getConversationTypeLabel,
		getConversationToneLabel
	} from '$lib/features/conversations/shared/utils';
	import { MessagesSquare } from 'lucide-svelte';
	import { ConversationMetadataCard, InterlocutorDetails } from './components';
	import ConversationTypeIcon from '$conversations/shared/components/conversation-type-icon.svelte';
	import { cn } from 'flowbite-svelte';

	const conversation = getConversationContext();
	const { type, aiTone, topic } = conversation;
</script>

<div class="flex flex-col gap-8">
	<InterlocutorDetails />

	<div class="flex gap-2 w-full">
		<ConversationMetadataCard label="Topic" value={getConversationTypeLabel(type)} class="flex-1">
			{#snippet Icon({ className })}
				<ConversationTypeIcon conversationType={type} class={className} />
			{/snippet}
		</ConversationMetadataCard>

		<ConversationMetadataCard label="AI Tone" value={getConversationToneLabel(aiTone)} class="flex-1">
			{#snippet Icon({ className })}
				<ConversationToneIcon tone={aiTone} class={className} />
			{/snippet}
		</ConversationMetadataCard>

		<ConversationMetadataCard label="Topic" value={topic} class="flex-2">
			{#snippet Icon({ className })}
				<MessagesSquare class={cn(className, 'opacity-70')} />
			{/snippet}
		</ConversationMetadataCard>
	</div>
</div>
