<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { AutoHeightTextarea } from '$lib/components/forms/auto-height-textarea';
	import EnhanceButton from './components/enhance-button.svelte';
	import SendButton from './components/send-button.svelte';

	interface Props {
		value?: string;
		placeholder: string;
		sendAriaLabel: string;
		maxLength?: number;
		disabled?: boolean;
		pending?: boolean;
		phraseDataTestId?: string;
		sendDataTestId?: string;
		onValueChange?: (value: string) => void;
		onSubmit?: (value: string) => void;
		/** Ghost text shown after the typed value (tab completion). */
		suggestion?: string;
		/** Tab / → at the end of the text accepts the suggestion. */
		onAcceptSuggestion?: () => void;
		/** Escape hides the suggestion. */
		onDismissSuggestion?: () => void;
		suggestionHintLabel?: string;
		/** Shows an "enhance" button that rewrites the typed text before it is sent. */
		onEnhance?: () => void;
		enhancing?: boolean;
		enhanceDisabled?: boolean;
		enhanceAriaLabel?: string;
		enhanceDataTestId?: string;
	}

	let {
		value = $bindable(''),
		placeholder,
		sendAriaLabel,
		maxLength,
		disabled = false,
		pending = false,
		phraseDataTestId,
		sendDataTestId,
		onValueChange,
		onSubmit,
		suggestion = '',
		onAcceptSuggestion,
		onDismissSuggestion,
		suggestionHintLabel,
		onEnhance,
		enhancing = false,
		enhanceDisabled = false,
		enhanceAriaLabel = '',
		enhanceDataTestId
	}: Props = $props();

	const showSuggestion = $derived(suggestion.length > 0 && !disabled);

	let isFocused = $state(false);
	/** Writable derived so send enablement tracks typing while still syncing external resets from `value`. */
	let phraseInput = $derived(value);

	const hasPhrase = $derived(
		phraseInput.trim().length > 0 && (maxLength === undefined || phraseInput.length <= maxLength)
	);
	/** Typing is blocked while the text is being sent or rewritten; the dimmed text shows it. */
	const inputLocked = $derived(disabled || enhancing);
	const sendDisabled = $derived(!hasPhrase || pending || disabled || enhancing);

	function publish(next: string) {
		phraseInput = next;
		value = next;
		onValueChange?.(next);
	}

	function handleInput(event: Event) {
		if (!(event.currentTarget instanceof HTMLTextAreaElement)) {
			return;
		}

		publish(event.currentTarget.value);
	}

	function submit() {
		const next = phraseInput.trim();

		if (!next || sendDisabled || !onSubmit) {
			return;
		}

		publish(phraseInput);
		onSubmit(phraseInput);
	}

	function isCaretAtEnd(event: KeyboardEvent) {
		const target = event.currentTarget;

		return (
			target instanceof HTMLTextAreaElement &&
			target.selectionStart === target.value.length &&
			target.selectionEnd === target.value.length
		);
	}

	function handleKeyDown(event: KeyboardEvent) {
		const hasModifier = event.shiftKey || event.altKey || event.ctrlKey || event.metaKey;

		if (showSuggestion && !hasModifier) {
			if (event.key === 'Tab' || (event.key === 'ArrowRight' && isCaretAtEnd(event))) {
				event.preventDefault();
				onAcceptSuggestion?.();

				return;
			}

			if (event.key === 'Escape') {
				event.preventDefault();
				onDismissSuggestion?.();

				return;
			}
		}

		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			submit();
		}
	}
</script>

<div
	class={cn(
		'flex w-full min-h-[52px] shrink-0 items-end gap-2 rounded-[27px] border border-line/90 bg-surface/95 px-4 py-2 shadow-[0_8px_32px_-12px] shadow-ink/12 ring-1 ring-ink/5 backdrop-blur-sm transition-[border-color,box-shadow]',
		isFocused &&
			'border-ink/25 shadow-[0_12px_40px_-14px] shadow-primary-600/20 ring-primary-600/10 dark:shadow-primary-400/15'
	)}
>
	<div class="relative flex min-h-9 w-full min-w-0 flex-1 items-center">
		{#if showSuggestion}
			<!-- Mirrors the textarea text so the ghost suggestion lines up right after the caret. -->
			<div
				class="message-body pointer-events-none absolute inset-0 overflow-hidden text-base leading-6 break-words whitespace-pre-wrap"
				aria-hidden="true"
			>
				<span class="invisible">{phraseInput}</span><span class="text-ink-subtle">{suggestion}</span>
				{#if suggestionHintLabel}
					<span
						class="ml-1.5 inline-flex -translate-y-px items-center rounded border border-line px-1 align-middle text-[10px] leading-4 font-medium text-ink-subtle uppercase"
					>
						{suggestionHintLabel}
					</span>
				{/if}
			</div>
		{/if}

		<AutoHeightTextarea
			dataTestId={phraseDataTestId}
			bind:value={phraseInput}
			{placeholder}
			{maxLength}
			disabled={inputLocked}
			className="flex min-h-0 w-full min-w-0 flex-1 items-center"
			textareaClass={cn(
				'message-body block text-base !px-0 !py-0 leading-6 placeholder:text-ink-subtle',
				inputLocked ? 'cursor-not-allowed text-ink-subtle' : 'text-ink'
			)}
			LINE_HEIGHT={24}
			VERTICAL_PADDING={0}
			onInput={handleInput}
			onkeydown={handleKeyDown}
			onfocus={() => (isFocused = true)}
			onblur={() => (isFocused = false)}
		/>
	</div>

	<div class="flex shrink-0 items-center gap-0.5 self-end">
		{#if onEnhance}
			<EnhanceButton
				dataTestId={enhanceDataTestId}
				ariaLabel={enhanceAriaLabel}
				disabled={enhanceDisabled || disabled || pending}
				pending={enhancing}
				onclick={onEnhance}
			/>
		{/if}
		<SendButton
			dataTestId={sendDataTestId}
			ariaLabel={sendAriaLabel}
			disabled={sendDisabled}
			{pending}
			onclick={submit}
		/>
	</div>
</div>
