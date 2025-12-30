<script lang="ts">
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { getSidepanelContext } from '$lib/features/conversations/pages/session/contexts/sidepanel-context.svelte';
	import size from 'lodash/size';

	interface ToggleSidepanelButtonProps {
		isSelected: boolean;
		feedback: ConversationUserMessageFeedbackDTO;
	}

	const { isSelected, feedback }: ToggleSidepanelButtonProps = $props();
	const sidepanelContext = getSidepanelContext();

	const totalCommentsCount = $derived.by(() => {
		return (
			size(feedback.mistakes) +
			size(feedback.strengthsIdentified) +
			size(feedback.vocabularyEnrichment) +
			size(feedback.alternativeExpressions) +
			(feedback.culturalNote ? 1 : 0)
		);
	});

	const commentsLabel = $derived.by(() => {
		if (totalCommentsCount === 1) return 'komentarz';
		if (totalCommentsCount >= 2 && totalCommentsCount <= 4) return 'komentarze';
		return 'komentarzy';
	});

	function handleClick() {
		if (isSelected) {
			sidepanelContext.isOpened = false;
			sidepanelContext.feedbackPreview = null;
			return;
		}

		sidepanelContext.isOpened = true;
		sidepanelContext.feedbackPreview = feedback;
	}
</script>

<button
	onclick={handleClick}
	class="text-primary-700 self-start text-xs mt-2 flex items-center gap-1 hover:text-primary-800 transition-colors"
>
	<span>
		Zobacz wszystkie <strong>{totalCommentsCount} {commentsLabel}</strong>
	</span>

	<ArrowRightOutline class="w-4 h-4" />
</button>
