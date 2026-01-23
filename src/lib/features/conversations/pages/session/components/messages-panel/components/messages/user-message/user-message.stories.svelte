<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import UserMessage from './user-message.svelte';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';
	import ConversationContextDecorator from '$lib/features/conversations/pages/session/contexts/storybook-decorators/conversation-context-decorator.svelte';
	import SidepanelContextDecorator from '$lib/features/conversations/pages/session/contexts/storybook-decorators/sidepanel-context-decorator.svelte';
	import type { CompactConversationUserMessage } from '$lib/types/conversation/domain/conversation-message';

	const { Story } = defineMeta({
		component: UserMessage,
		title: 'Features/Conversations/UserMessage',
		tags: ['autodocs'],
		decorators: [
			() => ConversationContextDecorator as any, //
			() => SidepanelContextDecorator as any,
			() => CenterComponentDecorator as any
		],
		args: {
			messageIndex: 0,
			message: {
				sender: 'USER',
				content: 'Hello, how are you today?',
				feedback: {
					id: 'feedback-1',
					tutorComment: 'Good effort! Keep practicing.',
					grammar: 7,
					vocabulary: 8,
					answerLength: 6,
					naturalness: 7,
					coherenceWithContext: 8,
					registerAppropriate: true,
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
			} satisfies CompactConversationUserMessage
		},
		argTypes: {
			message: {
				control: { type: 'object' },
				description: 'User message object with content and feedback'
			}
		}
	});
</script>

<Story
	name="Without Feedback"
	args={{
		messageIndex: 0,
		message: {
			sender: 'USER',
			content: 'This is a message without feedback',
			feedback: null
		} satisfies CompactConversationUserMessage
	}}
/>

<Story
	name="With Highlighted Feedback"
	args={{
		messageIndex: 0,
		message: {
			sender: 'USER',
			content: 'Hello, how are you today? I want to learn English better.',
			feedback: {
				id: 'feedback-1',
				tutorComment: 'Good effort! Keep practicing.',
				grammar: 7,
				vocabulary: 8,
				answerLength: 6,
				naturalness: 7,
				coherenceWithContext: 8,
				registerAppropriate: true,
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
		} satisfies CompactConversationUserMessage
	}}
/>
