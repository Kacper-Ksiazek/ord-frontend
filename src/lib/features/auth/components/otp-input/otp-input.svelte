<script lang="ts">
	import { onMount } from 'svelte';
	import type { OtpInputProps } from './otp-input.interface';
	import { E2E_TEST_IDS } from '$auth/testing/test-ids';
	import { cn } from '$lib/utils/cn';

	let {
		value = $bindable(''),
		onchange,
		oncomplete,
		disabled = false,
		error = false
	}: OtpInputProps = $props();

	const LENGTH = 6;
	let inputs: HTMLInputElement[] = [];
	let digits = $state<string[]>(Array(LENGTH).fill(''));

	$effect(() => {
		const valueArray = value.split('').slice(0, LENGTH);
		digits = [...valueArray, ...Array(LENGTH - valueArray.length).fill('')];
	});

	$effect(() => {
		const newValue = digits.join('');
		if (newValue !== value) {
			value = newValue;
			onchange?.(newValue);
		}
	});

	onMount(() => {
		if (inputs[0] && !disabled) {
			inputs[0].focus();
		}
	});

	function handleInput(index: number, event: Event) {
		const target = event.target as HTMLInputElement;
		const inputValue = target.value;

		if (inputValue && !/^\d$/.test(inputValue)) {
			target.value = digits[index] || '';

			return;
		}

		digits[index] = inputValue;

		if (inputValue && index < LENGTH - 1) {
			inputs[index + 1]?.focus();
		}
	}

	function handleKeyDown(index: number, event: KeyboardEvent) {
		switch (true) {
			case event.key === 'Backspace':
				if (!digits[index] && index > 0) {
					event.preventDefault();
					digits[index - 1] = '';
					inputs[index - 1]?.focus();
				} else if (digits[index]) {
					digits[index] = '';
				}
				break;

			case event.key === 'ArrowLeft':
				if (index > 0) {
					event.preventDefault();
					inputs[index - 1]?.focus();
				}
				break;

			case event.key === 'ArrowRight':
				if (index < LENGTH - 1) {
					event.preventDefault();
					inputs[index + 1]?.focus();
				}
				break;

			case event.key === 'Enter': {
				const currentValue = digits.join('');
				if (currentValue.length === LENGTH) {
					oncomplete?.(currentValue);
				}
				break;
			}

			case /^\d$/.test(event.key):
				event.preventDefault();
				digits[index] = event.key;
				if (index < LENGTH - 1) {
					inputs[index + 1]?.focus();
				}
				break;
		}
	}

	function handlePaste(event: ClipboardEvent) {
		event.preventDefault();
		const pastedData = event.clipboardData?.getData('text') || '';
		const pastedDigits = pastedData.replace(/\D/g, '').slice(0, LENGTH).split('');

		if (pastedDigits.length > 0) {
			digits = [...pastedDigits, ...Array(LENGTH - pastedDigits.length).fill('')];
			const nextEmptyIndex = Math.min(pastedDigits.length, LENGTH - 1);
			inputs[nextEmptyIndex]?.focus();
		}
	}

	function handleFocus(event: FocusEvent) {
		const target = event.target as HTMLInputElement;
		target.select();
	}
</script>

<div
	class="flex gap-2 justify-center"
	role="group"
	aria-label="OTP Input"
	data-testid={E2E_TEST_IDS.login.otpInput}
>
	{#each digits as digit, index (index)}
		<input
			bind:this={inputs[index]}
			data-testid={E2E_TEST_IDS.login.otpDigit(index + 1)}
			type="text"
			inputmode="numeric"
			maxlength={1}
			value={digit}
			oninput={(e) => handleInput(index, e)}
			onkeydown={(e) => handleKeyDown(index, e)}
			onpaste={index === 0 ? handlePaste : undefined}
			onfocus={handleFocus}
			{disabled}
			class={cn(
				'h-14 w-12 rounded-[10px] border text-center text-2xl font-medium outline-none transition-colors',
				'text-ink',
				error
					? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/25'
					: 'border-line focus:border-ink focus:ring-2 focus:ring-ink/20',
				disabled && 'cursor-not-allowed bg-accent-soft opacity-60',
				!disabled && (digit ? 'bg-surface' : 'bg-accent-soft'),
				digit && !error && 'border-ink/40'
			)}
			aria-label="Digit {index + 1}"
		/>
	{/each}
</div>
