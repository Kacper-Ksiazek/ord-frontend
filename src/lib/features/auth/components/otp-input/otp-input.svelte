<script lang="ts">
	import { onMount } from 'svelte';
	import type { OtpInputProps } from './otp-input.interface';

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

<div class="flex gap-2 justify-center" role="group" aria-label="OTP Input">
	{#each digits as digit, index}
		<input
			bind:this={inputs[index]}
			type="text"
			inputmode="numeric"
			maxlength={1}
			value={digit}
			oninput={(e) => handleInput(index, e)}
			onkeydown={(e) => handleKeyDown(index, e)}
			onpaste={index === 0 ? handlePaste : undefined}
			onfocus={handleFocus}
			{disabled}
			class="w-12 h-14 text-center text-2xl font-semibold border-2 rounded-lg transition-all
				text-gray-900 dark:text-white
				{error
				? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200 dark:border-red-400 dark:focus:border-red-500'
				: 'border-gray-300 dark:border-gray-600 focus:border-primary-600 focus:ring-2 focus:ring-primary-300'}
				{disabled
				? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
				: digit
					? 'bg-white dark:bg-gray-700'
					: 'bg-gray-50 dark:bg-gray-800'}
				{digit ? 'border-gray-400 dark:border-gray-500' : ''}
				outline-none"
			aria-label="Digit {index + 1}"
		/>
	{/each}
</div>
