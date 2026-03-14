<script lang="ts">
	import type { ConversationMessageStrength } from '$lib/types/conversation/domain/conversation-message-feedback';
	import type { AiAdviceBaseV2Block } from '../../ai-advice-base-v2/ai-advice.types';
	import { EXPLANATION_ICON } from '$conversations/pages/session/constants/icons';
	import { USER_MESSAGE_FEEDBACK_ICONS_MAP } from '$conversations/pages/session/constants/user-message-feedback/icons';
	import AiAdviceBaseV2 from '../../ai-advice-base-v2/ai-advice-base-v2.svelte';

	interface Props {
		strength: ConversationMessageStrength;
	}

	let { strength }: Props = $props();

	function toBlocks(strength: ConversationMessageStrength): {
		headerBlocks: AiAdviceBaseV2Block[];
		bodyBlocks: AiAdviceBaseV2Block[];
	} {
		return {
			headerBlocks: [
				{
					type: 'translation',
					label: 'Phrase',
					translation: {
						text: strength.phrase,
						Icon: USER_MESSAGE_FEEDBACK_ICONS_MAP['STRENGTHS'],
						badges: [
							{
								text: strength.strengthType
							}
						]
					}
					// No native language for strength card
				}
			],
			bodyBlocks: [
				{
					type: 'text',
					label: 'Explanation',
					text: strength.explanation,
					Icon: EXPLANATION_ICON
				}
			]
		};
	}

	const color = 'green' as const;
	const { headerBlocks, bodyBlocks } = toBlocks(strength);
</script>

<AiAdviceBaseV2 {color} {headerBlocks} {bodyBlocks} />
