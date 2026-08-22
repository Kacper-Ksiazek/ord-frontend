<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import AiPostProcessActionBase from './ai-post-process-action-base.svelte';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';
	import ConversationContextDecorator from '$conversations/pages/session/contexts/storybook-decorators/conversation-context-decorator.svelte';
	import SidepanelContextDecorator from '$conversations/pages/session/contexts/storybook-decorators/sidepanel-context-decorator.svelte';
	import TextWithThreeDotsAnimation from '$lib/components/utils/text-with-three-dots-animation.svelte';

	const { Story } = defineMeta({
		component: AiPostProcessActionBase,
		title: 'Features/Conversations/Session/AIPostProcessActionBase',
		decorators: [
			() => ConversationContextDecorator as any, //
			() => SidepanelContextDecorator as any,
			() => CenterComponentDecorator as any
		],
		args: {
			label: 'Wskazówki'
		},
		argTypes: {
			label: {
				control: { type: 'text' },
				description: 'Label text displayed with Sparkles icon'
			}
		}
	});
</script>

<script lang="ts">
	import PlayMessageAudio from './components/play-message-audio.svelte';
	import PlayMessageAudioProgress from './components/play-message-audio-progress.svelte';

	const sampleMessage =
		"The trail sounds magnificent! I'd love to hear more about the wildlife you encountered.";

	const messageIndex = 0;
</script>

<Story
	name="Default"
	args={{
		label: 'Wskazówki'
	}}
>
	<TextWithThreeDotsAnimation text="Przygotowywanie wskazówek" dotsWrapperClass="mb-0" />
</Story>

<Story name="With Play Audio">
	<AiPostProcessActionBase label="Wskazówki">
		{#snippet headerActions()}
			<PlayMessageAudio message={sampleMessage} {messageIndex} />
		{/snippet}

		{#snippet playbackProgress()}
			<PlayMessageAudioProgress {messageIndex} />
		{/snippet}

		<TextWithThreeDotsAnimation text="Przygotowywanie wskazówek" dotsWrapperClass="mb-0" />
	</AiPostProcessActionBase>
</Story>
