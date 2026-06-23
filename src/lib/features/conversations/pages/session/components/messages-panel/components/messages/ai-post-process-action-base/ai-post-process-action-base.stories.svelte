<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import AiPostProcessActionBase from './ai-post-process-action-base.svelte';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';
	import ConversationContextDecorator from '$lib/features/conversations/pages/session/contexts/storybook-decorators/conversation-context-decorator.svelte';
	import SidepanelContextDecorator from '$lib/features/conversations/pages/session/contexts/storybook-decorators/sidepanel-context-decorator.svelte';
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
			label: 'Wskazówki do nauki'
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
	import { speakTextPlayback } from '$lib/utils/speak-text.svelte';
	import { formatTime } from '$lib/utils/format-time';

	const sampleMessage =
		"The trail sounds magnificent! I'd love to hear more about the wildlife you encountered.";

	const messageIndex = 0;
	let showIconsInHighlightedParts = $state(false);

	const showPlaybackProgress = $derived(
		speakTextPlayback.id === messageIndex && speakTextPlayback.progress.duration > 0
	);
	const progressPercent = $derived(
		speakTextPlayback.progress.duration > 0
			? Math.min(
					100,
					(speakTextPlayback.progress.currentTime / speakTextPlayback.progress.duration) * 100
				)
			: 0
	);
</script>

<Story
	name="Default"
	args={{
		label: 'Wskazówki do nauki'
	}}
>
	<TextWithThreeDotsAnimation
		text="Trwa przygotowywanie materiałów edukacyjnych"
		dotsWrapperClass="mb-1"
	/>
</Story>

<Story name="With Play Audio">
	<AiPostProcessActionBase label="Wskazówki do nauki" bind:showIconsInHighlightedParts>
		{#snippet headerActions()}
			<PlayMessageAudio message={sampleMessage} {messageIndex} />
		{/snippet}

		{#snippet playbackProgress()}
			{#if showPlaybackProgress}
				<div class="flex flex-col gap-2" aria-live="polite">
					<div
						class="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
						role="progressbar"
						aria-valuemin="0"
						aria-valuemax={speakTextPlayback.progress.duration}
						aria-valuenow={speakTextPlayback.progress.currentTime}
						aria-label="Playback progress"
					>
						<div
							class="h-full w-full origin-left rounded-full bg-primary-600 transition-transform duration-300 ease-linear"
							style:transform="scaleX({progressPercent / 100})"
						></div>
					</div>
					<p class="text-xs text-gray-500 dark:text-gray-400">
						{formatTime(speakTextPlayback.progress.currentTime)} / {formatTime(
							speakTextPlayback.progress.duration
						)}
					</p>
				</div>
			{/if}
		{/snippet}

		<TextWithThreeDotsAnimation
			text="Trwa przygotowywanie materiałów edukacyjnych"
			dotsWrapperClass="mb-1"
		/>
	</AiPostProcessActionBase>
</Story>
