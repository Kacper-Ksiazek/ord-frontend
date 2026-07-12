<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import AiMessage from './ai-message.svelte';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';
	import ConversationContextDecorator from '$conversations/pages/session/contexts/storybook-decorators/conversation-context-decorator.svelte';
	import SidepanelContextDecorator from '$conversations/pages/session/contexts/storybook-decorators/sidepanel-context-decorator.svelte';
	import type { AIMessageLearningTips } from '$conversations/types';

	const defaultLearningTips: AIMessageLearningTips = {
		grammarTips: [
			{
				phrase: 'How can I assist',
				explanation: 'This is a polite way to offer help.',
				grammarPoint: 'Modal verbs for offers',
				exampleSentences: ['How can I assist you with your question?'],
				register: 'NEUTRAL',
				nativeLanguageEquivalent: 'Jak mogę pomóc'
			}
		],
		vocabularyTips: [
			{
				word: 'assist',
				definition: 'To help someone.',
				usageNote: 'More formal than "help"',
				wordType: 'VERB',
				exampleSentences: ['I can assist you with that.'],
				register: 'FORMAL',
				nativeLanguageEquivalent: 'pomóc'
			}
		],
		phraseTips: [
			{
				phrase: 'How can I assist you today?',
				phraseType: 'LITERAL',
				meaning: 'A polite way to offer help',
				exampleSentences: ['How can I assist you today?'],
				register: 'NEUTRAL',
				nativeLanguageEquivalent: 'Jak mogę ci dzisiaj pomóc?'
			}
		]
	};

	const { Story } = defineMeta({
		component: AiMessage,
		title: 'Features/Conversations/Session/AIMessage',
		decorators: [
			() => ConversationContextDecorator as any, //
			() => SidepanelContextDecorator as any,
			() => CenterComponentDecorator as any
		],
		args: {
			message: "Hello! I'm here to help you learn English. How can I assist you today?",
			messageIndex: 0,
			isStillGenerating: false,
			learningTips: defaultLearningTips
		},
		argTypes: {
			message: {
				control: { type: 'text' },
				description: 'Content of the AI message'
			},
			isStillGenerating: {
				control: { type: 'boolean' },
				description: 'Whether the message is still being generated'
			}
		}
	});
</script>

<Story name="Default" />

<Story
	name="Generating AI Message"
	args={{
		message: '',
		isStillGenerating: true,
		learningTips: null
	}}
/>

<Story
	name="Generating Learning Tips"
	args={{
		learningTips: null
	}}
/>
