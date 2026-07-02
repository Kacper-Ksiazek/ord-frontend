<script lang="ts">
	import { AxiosError } from 'axios';
	import { Alert, Button, Input } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { createRequestOtpMutation, createVerifyOtpMutation } from '$auth/api-client/mutations';
	import { AppLogo } from '$lib/components/identity/app-logo';
	import { OtpInput } from '$auth/components';
	import { m } from '$lib/paraglide/messages.js';
	import { authStore } from '$lib/stores/auth.svelte';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';

	let step = $state<'email' | 'otp'>('email');
	let email = $state('');
	let otpCode = $state('');
	let error = $state<string | null>(null);

	const requestOtpMutation = createRequestOtpMutation();
	const verifyOtpMutation = createVerifyOtpMutation();

	async function handleEmailSubmit() {
		error = null;

		if (!email || !email.includes('@')) {
			error = m['auth.login.error_invalid_email']();

			return;
		}

		try {
			await requestOtpMutation.mutateAsync({ email });
			step = 'otp';
		} catch (err: unknown) {
			if (err instanceof AxiosError) {
				error = err.response?.data?.message || m['auth.login.error_send_otp']();
			} else {
				error = m['auth.login.error_generic']();
			}
		}
	}

	async function handleOtpSubmit() {
		error = null;

		if (!otpCode || otpCode.length !== 6) {
			error = m['auth.login.error_invalid_otp']();

			return;
		}

		try {
			const user = await verifyOtpMutation.mutateAsync({ email, code: otpCode });

			authStore.setUser(user);

			goto('/');
		} catch (err: unknown) {
			if (err instanceof AxiosError) {
				error = err.response?.data?.message || m['auth.login.error_verify_otp']();
			} else {
				error = m['auth.login.error_generic']();
			}
		}
	}
</script>

<svelte:head>
	<title>{m['auth.login.title']()}</title>
</svelte:head>

<div class="w-full max-w-md px-4" data-testid={E2E_TEST_IDS.login.page}>
	<div>
		<div class="mb-6">
			<div class="w-32 h-32 mx-auto mb-4">
				<AppLogo size="lg" />
			</div>

			<div class="text-center">
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
					{step === 'email' ? m['auth.login.title']() : m['auth.login.verify_otp_title']()}
				</h1>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					{step === 'email' ? m['auth.login.email_subtitle']() : m['auth.login.otp_subtitle']({ email })}
				</p>
			</div>
		</div>

		{#if error}
			<div data-testid={E2E_TEST_IDS.login.error} role="alert">
				<Alert color="red" class="mb-4">
					<span class="font-medium">{m['auth.login.error_prefix']()}</span>
					{error}
				</Alert>
			</div>
		{/if}

		{#if step === 'email'}
			<form
				data-testid={E2E_TEST_IDS.login.emailForm}
				onsubmit={(e) => {
					e.preventDefault();
					handleEmailSubmit();
				}}
			>
				<div class="mb-6">
					<Input
						id="email"
						data-testid={E2E_TEST_IDS.login.emailInput}
						type="email"
						bind:value={email}
						placeholder={m['auth.login.email_placeholder']()}
						required
						size="lg"
					/>
				</div>

				<Button
					type="submit"
					size="lg"
					class="w-full"
					data-testid={E2E_TEST_IDS.login.emailSubmit}
					disabled={requestOtpMutation.isPending || !email || !email.includes('@')}
				>
					{requestOtpMutation.isPending
						? m['auth.login.sending_code']()
						: m['auth.login.continue_button']()}
				</Button>
			</form>
		{:else}
			<form
				data-testid={E2E_TEST_IDS.login.otpForm}
				onsubmit={(e) => {
					e.preventDefault();
					handleOtpSubmit();
				}}
			>
				<div class="mb-6">
					<OtpInput bind:value={otpCode} oncomplete={handleOtpSubmit} error={!!error} />
					<p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
						{m['auth.login.otp_instruction']()}
					</p>
				</div>

				<Button
					type="submit"
					size="lg"
					class="w-full mb-3"
					data-testid={E2E_TEST_IDS.login.otpSubmit}
					disabled={verifyOtpMutation.isPending || otpCode.length !== 6}
				>
					{verifyOtpMutation.isPending ? m['auth.login.verifying']() : m['auth.login.verify_button']()}
				</Button>
			</form>
		{/if}
	</div>
</div>
