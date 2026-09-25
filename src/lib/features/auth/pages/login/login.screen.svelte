<script lang="ts">
	import { AxiosError } from 'axios';
	import { ArrowRight, Loader2, Mail, ShieldCheck } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { afterNavigate, goto, replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { createRequestOtpMutation, createVerifyOtpMutation } from '$auth/api-client/mutations';
	import { OtpInput } from '$auth/components';
	import { authStore } from '$auth/stores';
	import { E2E_TEST_IDS } from '$auth/testing/test-ids';
	import { getDevLoginEmail, getDevLoginOtp } from '$auth/utils/dev-login-email';
	import { introStagger } from '$lib/attachments';
	import { Button } from '$lib/components/buttons/button';
	import { Input } from '$lib/components/forms/input';
	import { OrdLogo } from '$lib/components/ord-logo';
	import { Alert } from '$lib/components/utils/alert';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import { loginDeepLinkKey, parseLoginDeepLink } from './utils/parse-login-deep-link';

	const loginCopyIntro = introStagger({ startDelay: 0.28, interval: 0.08 });
	const initialDeepLink = parseLoginDeepLink(page.url.searchParams);

	let step = $state<'email' | 'otp'>(initialDeepLink.email ? 'otp' : 'email');
	let email = $state(initialDeepLink.email ?? getDevLoginEmail());
	let otpCode = $state(initialDeepLink.code ?? getDevLoginOtp());
	let error = $state<string | null>(null);
	let isVerifyingOtp = $state(initialDeepLink.email !== null && initialDeepLink.code !== null);
	let consumedDeepLinkKey: string | null = null;
	let deepLinkCode: string | null = initialDeepLink.code;
	let otpSubmitLock = false;

	const requestOtpMutation = createRequestOtpMutation();
	const verifyOtpMutation = createVerifyOtpMutation();
	const isOtpVerificationPending = $derived(isVerifyingOtp || verifyOtpMutation.isPending);

	async function handleEmailSubmit() {
		error = null;

		if (!email || !email.includes('@')) {
			error = m['auth.login.error_invalid_email']();

			return;
		}

		if (deepLinkCode && otpCode === deepLinkCode) {
			step = 'otp';

			return;
		}

		try {
			await requestOtpMutation.mutateAsync({ email, locale: getLocale() });
			step = 'otp';

			const devOtp = getDevLoginOtp();
			if (devOtp) {
				otpCode = devOtp;
			}
		} catch (err: unknown) {
			if (err instanceof AxiosError) {
				error = err.response?.data?.message || m['auth.login.error_send_otp']();
			} else {
				error = m['auth.login.error_generic']();
			}
		}
	}

	async function handleOtpSubmit() {
		if (otpSubmitLock || verifyOtpMutation.isPending) {
			return;
		}

		error = null;

		if (!otpCode || otpCode.length !== 6) {
			error = m['auth.login.error_invalid_otp']();
			isVerifyingOtp = false;

			return;
		}

		otpSubmitLock = true;
		isVerifyingOtp = true;

		try {
			const user = await verifyOtpMutation.mutateAsync({ email, code: otpCode });

			authStore.setUser(user);

			await goto(resolve('/'), { replaceState: true });
		} catch (err: unknown) {
			isVerifyingOtp = false;

			if (err instanceof AxiosError) {
				error = err.response?.data?.message || m['auth.login.error_verify_otp']();
			} else {
				error = m['auth.login.error_generic']();
			}
		} finally {
			otpSubmitLock = false;
		}
	}

	function handleOtpComplete(code: string) {
		otpCode = code;
		void handleOtpSubmit();
	}

	function clearLoginDeepLinkQuery() {
		if (!page.url.searchParams.has('email') && !page.url.searchParams.has('code')) {
			return;
		}

		replaceState(resolve('/login'), {});
	}

	function consumeLoginDeepLink() {
		if (!browser) {
			return;
		}

		const key = loginDeepLinkKey(page.url.searchParams);

		if (!key || key === consumedDeepLinkKey) {
			return;
		}

		const link = parseLoginDeepLink(page.url.searchParams);

		if (link.email) {
			email = link.email;
			step = 'otp';
		}

		if (link.code) {
			otpCode = link.code;
			deepLinkCode = link.code;
		}

		clearLoginDeepLinkQuery();
		consumedDeepLinkKey = key;

		if (link.email && link.code) {
			isVerifyingOtp = true;
			void handleOtpSubmit();
		}
	}

	// replaceState throws until the client router has finished starting.
	function scheduleConsumeLoginDeepLink(attempt = 0) {
		try {
			consumeLoginDeepLink();
		} catch (error) {
			const routerNotReady =
				error instanceof Error && error.message.includes('before router is initialized');

			if (routerNotReady && attempt < 10) {
				setTimeout(() => scheduleConsumeLoginDeepLink(attempt + 1));

				return;
			}

			throw error;
		}
	}

	onMount(() => {
		scheduleConsumeLoginDeepLink();
	});

	afterNavigate(() => {
		scheduleConsumeLoginDeepLink();
	});
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
						leftAdornment={Mail}
						placeholder={m['auth.login.email_placeholder']()}
						ariaLabel={m['auth.login.email_placeholder']()}
					/>

					<Button
						class="w-full justify-center"
						dataTestId={E2E_TEST_IDS.login.emailSubmit}
						disabled={requestOtpMutation.isPending || !email || !email.includes('@')}
						onClick={() => void handleEmailSubmit()}
					>
						<span class="inline-flex items-center gap-1.5">
							{requestOtpMutation.isPending
								? m['auth.login.sending_code']()
								: m['auth.login.continue_button']()}
							{#if requestOtpMutation.isPending}
								<Loader2 class="size-4 shrink-0 animate-spin" aria-hidden="true" />
							{:else}
								<ArrowRight class="size-4 shrink-0" aria-hidden="true" />
							{/if}
						</span>
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
					<OtpInput
						bind:value={otpCode}
						oncomplete={handleOtpComplete}
						error={!!error}
						disabled={isOtpVerificationPending}
					/>
					<p class="text-center text-sm text-ink-muted">
						{m['auth.login.otp_instruction']()}
					</p>

					<Button
						class="w-full justify-center"
						dataTestId={E2E_TEST_IDS.login.otpSubmit}
						disabled={isOtpVerificationPending || otpCode.length !== 6}
						onClick={() => void handleOtpSubmit()}
					>
						<span class="inline-flex items-center gap-1.5">
							{isOtpVerificationPending ? m['auth.login.verifying']() : m['auth.login.verify_button']()}
							{#if isOtpVerificationPending}
								<Loader2 class="size-4 shrink-0 animate-spin" aria-hidden="true" />
							{:else}
								<ShieldCheck class="size-4 shrink-0" aria-hidden="true" />
							{/if}
						</span>
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
