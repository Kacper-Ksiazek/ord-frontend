<script lang="ts">
import { AxiosError } from 'axios';
import { Alert, Button, Input } from 'flowbite-svelte';
import { goto } from '$app/navigation';
import { createRequestOtpMutation, createVerifyOtpMutation } from '$lib/api-client/auth/mutations';
import { LanguagePicker } from '$lib/components/language-picker';
import { ThemeSwitcher } from '$lib/components/theme-switcher';
import { OtpInput } from '$lib/features/auth/components/otp-input';
import { authStore } from '$lib/stores/auth.svelte';

let step = $state<'email' | 'otp'>('email');
let email = $state('');
let otpCode = $state('');
let error = $state<string | null>(null);

const requestOtpMutation = createRequestOtpMutation();
const verifyOtpMutation = createVerifyOtpMutation();

async function handleEmailSubmit() {
	error = null;

	if (!email || !email.includes('@')) {
		error = 'Please enter a valid email address';
		return;
	}

	try {
		await requestOtpMutation.mutateAsync({ email });
		step = 'otp';
	} catch (err: unknown) {
		if (err instanceof AxiosError) {
			error = err.response?.data?.message || 'Failed to send OTP code. Please try again.';
		} else {
			error = 'An unexpected error occurred. Please try again.';
		}
	}
}

async function handleOtpSubmit() {
	error = null;

	if (!otpCode || otpCode.length !== 6) {
		error = 'Please enter a valid 6-digit code';
		return;
	}

	try {
		const user = await verifyOtpMutation.mutateAsync({ email, code: otpCode });

		// Save user to auth store (which also saves to localStorage)
		authStore.setUser(user);

		// Redirect to home page
		goto('/');
	} catch (err: unknown) {
		if (err instanceof AxiosError) {
			error = err.response?.data?.message || 'Invalid OTP code. Please try again.';
		} else {
			error = 'An unexpected error occurred. Please try again.';
		}
	}
}
</script>

<div class="w-full max-w-md px-4">
	<div>
		<div class="mb-6">
			<div class="flex justify-end gap-2 mb-4">
				<LanguagePicker />
				<ThemeSwitcher />
			</div>
			<div class="text-center">
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
					{step === 'email' ? 'Sign In' : 'Verify OTP'}
				</h1>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					{step === 'email'
						? 'Enter your email to receive a verification code'
						: `We sent a code to ${email}`}
				</p>
			</div>
		</div>

		{#if error}
			<Alert color="red" class="mb-4">
				<span class="font-medium">Error:</span> {error}
			</Alert>
		{/if}

		{#if step === 'email'}
			<form onsubmit={(e) => { e.preventDefault(); handleEmailSubmit(); }}>
				<div class="mb-6">
					<Input
						id="email"
						type="email"
						bind:value={email}
						placeholder="your-email@example.com"
						required
						size="lg"
					/>
				</div>

				<Button
					type="submit"
					size="lg"
					class="w-full"
					disabled={requestOtpMutation.isPending || !email || !email.includes('@')}
				>
					{requestOtpMutation.isPending ? 'Sending code...' : 'Continue'}
				</Button>
			</form>
		{:else}
			<form onsubmit={(e) => { e.preventDefault(); handleOtpSubmit(); }}>
				<div class="mb-6">
					<OtpInput
						bind:value={otpCode}
						oncomplete={handleOtpSubmit}
						error={!!error}
					/>
					<p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
						Enter the 6-digit code sent to your email
					</p>
				</div>

				<Button
					type="submit"
					size="lg"
					class="w-full mb-3"
					disabled={verifyOtpMutation.isPending || otpCode.length !== 6}
				>
					{verifyOtpMutation.isPending ? 'Verifying...' : 'Verify Code'}
				</Button>
			</form>
		{/if}
	</div>
</div>
