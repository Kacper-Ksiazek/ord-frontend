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
		'flex w-full min-h-10 shrink-0 items-center gap-2 rounded-[10px] border border-line bg-surface px-4 py-2',
		isFocused && 'border-ink'
	)}
>
	<AutoHeightTextarea
		dataTestId={phraseDataTestId}
		bind:value={phraseInput}
		{placeholder}
		{maxLength}
		{disabled}
		className="flex min-h-8 w-full min-w-0 items-center self-center"
		textareaClass="message-body text-ink px-0 py-0 leading-[1.8] placeholder:text-ink-muted"
		LINE_HEIGHT={26}
		VERTICAL_PADDING={0}
		onInput={handleInput}
		onkeydown={handleKeyDown}
		onfocus={() => (isFocused = true)}
		onblur={() => (isFocused = false)}
	/>

	<div class="shrink-0 self-end">
		<SendButton
			dataTestId={sendDataTestId}
			ariaLabel={sendAriaLabel}
			disabled={sendDisabled}
			{pending}
			onclick={submit}
		/>
	</div>
</div>
