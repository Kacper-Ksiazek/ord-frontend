<script lang="ts">
	import type { ConversationMessageStrength } from '$lib/types/conversation/domain/conversation-message-feedback';
	import type {
		AiAdviceBaseBlock,
		DerivedAiAdviceCardProps
	} from '../../ai-advice-base/ai-advice.types';
	import { EXPLANATION_ICON } from '$conversations/pages/session/constants/icons';
	import { USER_MESSAGE_FEEDBACK_ICONS_MAP } from '$conversations/pages/session/constants/user-message-feedback/icons';
	import AiAdviceBase from '../../ai-advice-base/ai-advice-base.svelte';

	interface Props extends DerivedAiAdviceCardProps {
		strength: ConversationMessageStrength;
	}

	let { strength, isExpandable, defaultExpandState }: Props = $props();

	function toBlocks(strength: ConversationMessageStrength): {
		headerBlocks: AiAdviceBaseBlock[];
		bodyBlocks: AiAdviceBaseBlock[];
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

<AiAdviceBase {color} {headerBlocks} {bodyBlocks} {isExpandable} {defaultExpandState} />
