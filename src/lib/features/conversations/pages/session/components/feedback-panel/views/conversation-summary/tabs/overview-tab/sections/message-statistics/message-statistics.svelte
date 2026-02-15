<script lang="ts">
	import size from 'lodash/size';
	import { USER_MESSAGE_FEEDBACK_ICONS_MAP } from '$conversations/pages/session/consts/user-message-feedback/icons';
	import type {
		CompactConversationAiMessage,
		CompactConversationMessage,
		CompactConversationUserMessage
	} from '$lib/types/conversation/domain/conversation-message';
	import MessageCard from './components/message-card.svelte';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
	import { getUserMessageFeedbackColorName } from '$conversations/pages/session/consts/user-message-feedback/colors';
	import AuthUserAvatar from '$lib/components/auth-user-avatar.svelte';
	import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$conversations/pages/session/consts/ai-message-learning-tips/icons';
	import { getAiMessageLearningTipColorName } from '$conversations/pages/session/consts/ai-message-learning-tips/colors';

	interface MessageStatisticsProps {
		userMessages: CompactConversationUserMessage[];
		aiMessages: CompactConversationAiMessage[];
	}

	const { userMessages, aiMessages }: MessageStatisticsProps = $props();

	function calculateAverageCharacters(messages: CompactConversationMessage[]): number {
		return messages.reduce((acc, msg) => acc + msg.content.length, 0) / messages.length;
	}

	const feedbackStats: Record<MessageFeedbackCriteria, number> = $derived(
		userMessages.reduce(
			(acc, msg) => {
				if (msg.feedback) {
					acc.MISTAKES += size(msg.feedback.mistakes);
					acc.STRENGTHS += size(msg.feedback.strengths);
					acc.SUGGESTIONS += size(msg.feedback.suggestions);
				}

				return acc;
			},
			{ MISTAKES: 0, STRENGTHS: 0, SUGGESTIONS: 0 }
		)
	);

	const learningTipsStats: Record<LearningTipCategory, number> = $derived(
		aiMessages.reduce(
			(acc: Record<LearningTipCategory, number>, msg: CompactConversationAiMessage) => {
				if (msg.learningTips) {
					acc.GRAMMAR += size(msg.learningTips.grammarTips);
					acc.VOCABULARY += size(msg.learningTips.vocabularyTips);
					acc.PHRASES += size(msg.learningTips.phraseTips);
				}

				return acc;
			},
			{ GRAMMAR: 0, VOCABULARY: 0, PHRASES: 0 }
		)
	);
</script>

<div class="space-y-4">
	<h3 class="heading-5">Message Statistics</h3>
	<div class="grid grid-cols-2 gap-4">
		<MessageCard
			label="User Messages"
			messageCount={userMessages.length}
			averageCharacters={calculateAverageCharacters(userMessages)}
			stats={[
				{
					Icon: USER_MESSAGE_FEEDBACK_ICONS_MAP.MISTAKES,
					color: getUserMessageFeedbackColorName('MISTAKES'),
					value: feedbackStats.MISTAKES
				},
				{
					Icon: USER_MESSAGE_FEEDBACK_ICONS_MAP.STRENGTHS,
					color: getUserMessageFeedbackColorName('STRENGTHS'),
					value: feedbackStats.STRENGTHS
				},
				{
					Icon: USER_MESSAGE_FEEDBACK_ICONS_MAP.SUGGESTIONS,
					color: getUserMessageFeedbackColorName('SUGGESTIONS'),
					value: feedbackStats.SUGGESTIONS
				}
			]}
		>
			{#snippet avatar()}
				<AuthUserAvatar size={40} class="rounded-full" />
			{/snippet}
		</MessageCard>

		<MessageCard
			label="AI Messages"
			messageCount={aiMessages.length}
			averageCharacters={calculateAverageCharacters(aiMessages)}
			stats={[
				{
					Icon: AI_MESSAGE_LEARNING_TIP_ICONS_MAP.GRAMMAR,
					color: getAiMessageLearningTipColorName('GRAMMAR'),
					value: learningTipsStats.GRAMMAR
				},
				{
					Icon: AI_MESSAGE_LEARNING_TIP_ICONS_MAP.VOCABULARY,
					color: getAiMessageLearningTipColorName('VOCABULARY'),
					value: learningTipsStats.VOCABULARY
				},
				{
					Icon: AI_MESSAGE_LEARNING_TIP_ICONS_MAP.PHRASES,
					color: getAiMessageLearningTipColorName('PHRASES'),
					value: learningTipsStats.PHRASES
				}
			]}
		>
			{#snippet avatar()}
				<AuthUserAvatar size={40} class="rounded-full" />
			{/snippet}
		</MessageCard>
	</div>
</div>
