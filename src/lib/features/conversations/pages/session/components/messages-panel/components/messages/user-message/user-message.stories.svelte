<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import UserMessage from './user-message.svelte';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';
	import ConversationContextDecorator from '$conversations/pages/session/contexts/storybook-decorators/conversation-context-decorator.svelte';
	import SidepanelContextDecorator from '$conversations/pages/session/contexts/storybook-decorators/sidepanel-context-decorator.svelte';
	import type { CompactConversationUserMessage } from '$conversations/types';

	const defaultMessage: CompactConversationUserMessage = {
		sender: 'USER',
		content: 'Hello, how are you today?',
		createdAt: new Date().toISOString(),
		analysis: {
			id: 'analysis-1',
			isSabotage: false,
			tutorComment: 'Good effort! Keep practicing.',
			grammar: 7,
			vocabulary: 8,
			naturalness: 7,
			coherenceWithContext: 8,
			messageId: 'msg-1',
			mistakes: [
				{
					phrase: 'how are you',
					severity: 'MINOR',
					errorType: 'GRAMMAR',
					explanation: 'Consider using "How are you doing?" for a more natural expression.',
					correctForm: 'How are you doing?'
				}
			],
			strengths: [
				{
					phrase: 'Hello',
					strengthType: 'COMMUNICATION',
					explanation: 'Great greeting!'
				}
			],
			suggestions: [
				{
					original: 'today',
					suggestionType: 'VOCABULARY',
					alternatives: ['this morning', 'this afternoon'],
					explanation: 'You could use "this morning" or "this afternoon" for more specificity.'
				}
			]
		}
	};

	const { Story } = defineMeta({
		component: UserMessage,
		title: 'Features/Conversations/Session/UserMessage',
		decorators: [
			() => ConversationContextDecorator as any, //
			() => SidepanelContextDecorator as any,
			() => CenterComponentDecorator as any
		],
		args: {
			messageIndex: 0,
			message: defaultMessage
		},
		argTypes: {
			message: {
				control: { type: 'object' },
				description: 'User message object with content and feedback'
			}
		}
	});
</script>

<Story name="Default" />

<Story
	name="Generating Analysis"
	args={{
		message: { ...defaultMessage, analysis: null }
	}}
/>
