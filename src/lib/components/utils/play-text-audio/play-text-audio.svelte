<script lang="ts">
	import { onDestroy } from 'svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { LoaderCircle, Square, Volume2 } from 'lucide-svelte';
	import { speakText, stopSpeaking } from '$lib/utils/speak-text';
	import { speakTextPlayback } from '$lib/utils/speak-text.svelte';

	interface PlayTextAudioProps {
		text: string;
		id: string | number;
		disabled?: boolean;
		dataTestId?: string;
	}

	let { text, id, disabled = false, dataTestId }: PlayTextAudioProps = $props();

	let errorMessage = $state<string | null>(null);
	let errorTimeoutId: ReturnType<typeof setTimeout> | undefined;

	const isThisActive = $derived(speakTextPlayback.id === id);
	const isLoading = $derived(isThisActive && speakTextPlayback.status === 'loading');
	const isPlaying = $derived(isThisActive && speakTextPlayback.status === 'playing');
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
				Icon: LoaderCircle,
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
			tooltip: 'Play audio',
			ariaLabel: 'Play audio'
		};
	});

	const isDisabled = $derived(disabled || !text.trim());

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
			await speakText(text.trim(), { id });
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
	{dataTestId}
	icon={Icon}
	{ariaLabel}
	{tooltip}
	{onClick}
	disabled={isDisabled}
	type="OUTLINED"
	variant="TEXT"
	class="h-8 w-8 shrink-0 border-none"
	iconClass={isLoading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'}
/>
