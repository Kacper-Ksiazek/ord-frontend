<script lang="ts">
	import { onDestroy } from 'svelte';
	import { IconButton } from '$lib/components/actions/icon-button';
	import { Loader2, Square, Volume2 } from 'lucide-svelte';
	import { speakText, stopSpeaking } from '$lib/utils/speak-text';
	import { speakTextPlayback } from '$lib/utils/speak-text.svelte';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';

	interface PlayMessageAudioProps {
		message: string;
		messageIndex: number;
		disabled?: boolean;
	}

	let { message, messageIndex, disabled = false }: PlayMessageAudioProps = $props();

	let errorMessage = $state<string | null>(null);
	let errorTimeoutId: ReturnType<typeof setTimeout> | undefined;

	const isThisMessageActive = $derived(speakTextPlayback.id === messageIndex);
	const isLoading = $derived(isThisMessageActive && speakTextPlayback.status === 'loading');
	const isPlaying = $derived(isThisMessageActive && speakTextPlayback.status === 'playing');
	const isActive = $derived(isLoading || isPlaying);

	const { Icon, tooltip, ariaLabel } = $derived.by(() => {
		if (errorMessage) {
			return {
				Icon: Volume2,
				tooltip: errorMessage,
				ariaLabel: errorMessage
			};
		}

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

	function showError(errorText: string) {
		errorMessage = errorText;

		if (errorTimeoutId) {
			clearTimeout(errorTimeoutId);
		}

		errorTimeoutId = setTimeout(() => {
			errorMessage = null;
			errorTimeoutId = undefined;
		}, 5000);
	}

	async function onClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		if (isDisabled) {
			return;
		}

		errorMessage = null;

		if (errorTimeoutId) {
			clearTimeout(errorTimeoutId);
			errorTimeoutId = undefined;
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
			showError(error instanceof Error ? error.message : 'Request failed');
		}

		(e.target as HTMLElement).blur();
	}

	onDestroy(() => {
		if (errorTimeoutId) {
			clearTimeout(errorTimeoutId);
		}
	});
</script>

<IconButton
	dataTestId={E2E_TEST_IDS.session.messageTtsButton(messageIndex)}
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
