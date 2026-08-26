<script lang="ts">
	import { AxiosError } from 'axios';
	import { goto } from '$app/navigation';
	import { createRequestOtpMutation, createVerifyOtpMutation } from '$auth/api-client/mutations';
	import { OtpInput } from '$auth/components';
	import { authStore } from '$auth/stores';
	import { E2E_TEST_IDS } from '$auth/testing/test-ids';
	import { introStagger } from '$lib/attachments';
	import { Button } from '$lib/components/buttons/button';
	import { Input } from '$lib/components/forms/input';
	import { OrdLogo } from '$lib/components/ord-logo';
	import { Alert } from '$lib/components/utils/alert';
	import { m } from '$lib/paraglide/messages.js';

	const loginCopyIntro = introStagger({ startDelay: 0.28, interval: 0.08 });

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

	function handleOtpComplete() {
		void handleOtpSubmit();
	}
</script>

<svelte:head>
	<title>{m['auth.login.title']()}</title>
</svelte:head>

<div class="mx-auto w-full max-w-sm px-4" data-testid={E2E_TEST_IDS.login.page}>
	<div class="mb-8 flex justify-center">
		<OrdLogo size="xl" animate id="login-ord-logo" />
	</div>

	<div {@attach loginCopyIntro}>
		<h1
			data-intro
			class="mb-2 text-center text-[32px] font-medium leading-10 tracking-tight text-ink"
		>
			{step === 'email' ? m['auth.login.title']() : m['auth.login.verify_otp_title']()}
		</h1>
		<p data-intro class="mb-8 text-center text-[15px] leading-[22px] text-ink-muted">
			{step === 'email' ? m['auth.login.email_subtitle']() : m['auth.login.otp_subtitle']({ email })}
		</p>

		{#if error}
			<div class="mb-4" data-testid={E2E_TEST_IDS.login.error}>
				<Alert>
					<span class="font-medium">{m['auth.login.error_prefix']()}</span>
					{error}
				</Alert>
			</div>
		{/if}

		<div data-intro>
			{#if step === 'email'}
				<form
					class="flex flex-col gap-4"
					data-testid={E2E_TEST_IDS.login.emailForm}
					onsubmit={(e) => {
						e.preventDefault();
						void handleEmailSubmit();
					}}
				>
					<Input
						dataTestId={E2E_TEST_IDS.login.emailInput}
						type="email"
						bind:value={email}
						placeholder={m['auth.login.email_placeholder']()}
						ariaLabel={m['auth.login.email_placeholder']()}
					/>

					<Button
						class="w-full justify-center"
						dataTestId={E2E_TEST_IDS.login.emailSubmit}
						disabled={requestOtpMutation.isPending || !email || !email.includes('@')}
						onClick={() => void handleEmailSubmit()}
					>
						{requestOtpMutation.isPending
							? m['auth.login.sending_code']()
							: m['auth.login.continue_button']()}
					</Button>
				</form>
			{:else}
				<form
					class="flex flex-col gap-4"
					data-testid={E2E_TEST_IDS.login.otpForm}
					onsubmit={(e) => {
						e.preventDefault();
						void handleOtpSubmit();
					}}
				>
					<OtpInput bind:value={otpCode} oncomplete={handleOtpComplete} error={!!error} />
					<p class="text-center text-sm text-ink-muted">
						{m['auth.login.otp_instruction']()}
					</p>

					<Button
						class="w-full justify-center"
						dataTestId={E2E_TEST_IDS.login.otpSubmit}
						disabled={verifyOtpMutation.isPending || otpCode.length !== 6}
						onClick={() => void handleOtpSubmit()}
					>
						{verifyOtpMutation.isPending ? m['auth.login.verifying']() : m['auth.login.verify_button']()}
					</Button>
				</form>
			{/if}
		</div>
	</div>
</div>

<style>
	@media (prefers-reduced-motion: no-preference) {
		[data-intro] {
			opacity: 0;
		}
	}
</style>
