<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { AutoHeightTextarea } from '$lib/components/forms/auto-height-textarea';
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
		onSubmit
	}: Props = $props();

	let isFocused = $state(false);
	/** Writable derived so send enablement tracks typing while still syncing external resets from `value`. */
	let phraseInput = $derived(value);

	const hasPhrase = $derived(
		phraseInput.trim().length > 0 && (maxLength === undefined || phraseInput.length <= maxLength)
	);
	const sendDisabled = $derived(!hasPhrase || pending || disabled);

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

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			submit();
		}
	}
</script>

<div
	class={cn(
		'flex w-full min-h-[52px] shrink-0 items-center gap-2 rounded-full border border-line/90 bg-surface/95 px-4 py-2 shadow-[0_8px_32px_-12px] shadow-ink/12 ring-1 ring-ink/5 backdrop-blur-sm transition-[border-color,box-shadow]',
		isFocused &&
			'border-ink/25 shadow-[0_12px_40px_-14px] shadow-primary-600/20 ring-primary-600/10 dark:shadow-primary-400/15'
	)}
>
	<AutoHeightTextarea
		dataTestId={phraseDataTestId}
		bind:value={phraseInput}
		{placeholder}
		{maxLength}
		{disabled}
		className="flex min-h-0 w-full min-w-0 flex-1 items-center"
		textareaClass="message-body block text-base text-ink !px-0 !py-0 leading-6 placeholder:text-ink-subtle"
		LINE_HEIGHT={24}
		VERTICAL_PADDING={0}
		onInput={handleInput}
		onkeydown={handleKeyDown}
		onfocus={() => (isFocused = true)}
		onblur={() => (isFocused = false)}
	/>

	<div class="shrink-0 self-center">
		<SendButton
			dataTestId={sendDataTestId}
			ariaLabel={sendAriaLabel}
			disabled={sendDisabled}
			{pending}
			onclick={submit}
		/>
	</div>
</div>
