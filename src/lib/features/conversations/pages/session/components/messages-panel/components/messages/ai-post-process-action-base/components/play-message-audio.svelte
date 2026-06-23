<script lang="ts">
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { Loader2, Square, Volume2 } from 'lucide-svelte';
	import { speakText, stopSpeaking } from '$lib/utils/speak-text';
	import { speakTextPlayback } from '$lib/utils/speak-text.svelte';

	interface PlayMessageAudioProps {
		message: string;
		messageIndex: number;
		disabled?: boolean;
	}

	let { message, messageIndex, disabled = false }: PlayMessageAudioProps = $props();

	const isThisMessageActive = $derived(speakTextPlayback.id === messageIndex);
	const isLoading = $derived(isThisMessageActive && speakTextPlayback.status === 'loading');
	const isPlaying = $derived(isThisMessageActive && speakTextPlayback.status === 'playing');
	const isActive = $derived(isLoading || isPlaying);

	const { Icon, tooltip, ariaLabel } = $derived.by(() => {
		if (isLoading) {
			return {
				Icon: Loader2,
				tooltip: 'Loading audio',
				ariaLabel: 'Loading audio'
			};
		}

		if (isPlaying) {
			return {
				Icon: Square,
				tooltip: 'Stop playback',
				ariaLabel: 'Stop playback'
			};
		}

		return {
			Icon: Volume2,
			tooltip: 'Play message',
			ariaLabel: 'Play message'
		};
	});

	const isDisabled = $derived(disabled || !message.trim());

	async function onClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		if (isDisabled) {
			return;
		}

		if (isActive) {
			stopSpeaking();
			(e.target as HTMLElement).blur();

			return;
		}

		try {
			await speakText(message.trim(), {
				id: messageIndex
			});
		} catch (error) {
			console.error('Failed to play message audio:', error);
		}

		(e.target as HTMLElement).blur();
	}
</script>

<IconButton
	icon={Icon}
	{ariaLabel}
	{tooltip}
	{onClick}
	disabled={isDisabled}
	type="OUTLINED"
	variant="TEXT"
	class="h-[32px] w-[32px] border-none"
	iconClass={isLoading ? 'w-4 h-4 animate-spin' : 'w-4 h-4'}
/>
