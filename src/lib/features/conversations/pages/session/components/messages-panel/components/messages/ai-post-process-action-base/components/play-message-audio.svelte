<script lang="ts">
	import { onDestroy } from 'svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { LoaderCircle, Square, Volume2 } from 'lucide-svelte';
	import { speakText, stopSpeaking } from '$lib/utils/speak-text';
	import { speakTextPlayback } from '$lib/utils/speak-text.svelte';
	import type { LanguageName } from '$lib/types/core/domain/languages';
	import { getConversationContext } from '$conversations/pages/session/contexts/conversation-context.svelte';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';

	interface PlayMessageAudioProps {
		message: string;
		messageIndex: number;
		language?: LanguageName;
		disabled?: boolean;
	}

	let { message, messageIndex, language, disabled = false }: PlayMessageAudioProps = $props();

	const conversationLanguage = $derived.by(() => {
		if (language) {
			return language;
		}

		try {
			return getConversationContext().language;
		} catch {
			return undefined;
		}
	});

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
				id: messageIndex,
				language: conversationLanguage
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
