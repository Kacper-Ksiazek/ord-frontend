<script lang="ts">
import { AxiosError } from 'axios';
import { Alert, Button, Input } from 'flowbite-svelte';
import { goto } from '$app/navigation';
import { createRequestOtpMutation, createVerifyOtpMutation } from '$lib/api-client/auth/mutations';
import LogoDark from '$lib/assets/images/logo-dark.png';
import LogoLight from '$lib/assets/images/logo-light.png';
import { OtpInput } from '$lib/features/auth/components/otp-input';
import { m } from '$lib/paraglide/messages.js';
import { authStore } from '$lib/stores/auth.svelte';
import { themeStore } from '$lib/stores/theme.svelte';

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

<div class="w-full max-w-md px-4">
	<div>
		<div class="mb-6">
			<div class="w-32 h-32 mx-auto mb-4">
				<img src={themeStore.isDark ? LogoDark : LogoLight} alt="Logo" class="w-full h-full object-contain" />
			</div>

			<div class="text-center">
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
					{step === 'email' ? m['auth.login.title']() : m['auth.login.verify_otp_title']()}
				</h1>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					{step === 'email'
						? m['auth.login.email_subtitle']()
						: m['auth.login.otp_subtitle']({ email })}
				</p>
			</div>
		</div>

		{#if error}
			<Alert color="red" class="mb-4">
				<span class="font-medium">{m['auth.login.error_prefix']()}</span> {error}
			</Alert>
		{/if}

		{#if step === 'email'}
			<form onsubmit={(e) => { e.preventDefault(); handleEmailSubmit(); }}>
				<div class="mb-6">
					<Input
						id="email"
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
					disabled={requestOtpMutation.isPending || !email || !email.includes('@')}
				>
					{requestOtpMutation.isPending ? m['auth.login.sending_code']() : m['auth.login.continue_button']()}
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
						{m['auth.login.otp_instruction']()}
					</p>
				</div>

				<Button
					type="submit"
					size="lg"
					class="w-full mb-3"
					disabled={verifyOtpMutation.isPending || otpCode.length !== 6}
				>
					{verifyOtpMutation.isPending ? m['auth.login.verifying']() : m['auth.login.verify_button']()}
				</Button>
			</form>
		{/if}
	</div>
</div>
