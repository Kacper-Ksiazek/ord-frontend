<script lang="ts">
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { ArrowRight } from 'lucide-svelte';
	import { getSidepanelContext } from '$lib/features/conversations/pages/session/contexts/sidepanel-context.svelte';
	import size from 'lodash/size';

	interface ToggleSidepanelButtonProps {
		isSelected: boolean;
		feedback: ConversationUserMessageFeedbackDTO;
	}

	const { isSelected, feedback }: ToggleSidepanelButtonProps = $props();
	const sidepanelContext = getSidepanelContext();

	const totalCommentsCount = $derived.by(() => {
		return size(feedback.mistakes) + size(feedback.strengths) + size(feedback.suggestions);
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
