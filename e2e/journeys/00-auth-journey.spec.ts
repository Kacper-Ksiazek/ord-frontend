import { test, expect } from '@e2e/shared/fixtures/auth.fixture';
import { emailForWorker, isE2eAuthConfigured, testEnv } from '@e2e/shared/fixtures/test-env';
import { resolveOtpCode } from '@e2e/shared/helpers/otp';
import { createSidebarComponent } from '@e2e/app-layouts';
import { createConversationsListPage } from '@e2e/conversations/list';

function wrongOtpCode(correctCode: string): string {
	const wrong = correctCode
		.split('')
		.map((digit) => String((Number(digit) + 1) % 10))
		.join('');

	return wrong === correctCode ? '654321' : wrong;
}

test.describe('Auth journey', () => {
	test.describe.configure({ mode: 'serial' });

	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('login, access app, logout, and block private routes', async ({
		page,
		loginPage
	}, testInfo) => {
		const email = emailForWorker(testInfo.workerIndex);
		const conversationsListPage = createConversationsListPage(page);
		const sidebar = createSidebarComponent(page);

		await test.step('01. Redirect to login from a private route', async () => {
			await conversationsListPage.goto();
			await expect(page).toHaveURL(/\/login/);
		});

		await test.step('02. Log in with OTP', async () => {
			await loginPage.loginWithOtp(email, undefined, { assumeOnLoginPage: true });
		});

		await test.step('03. Access conversations and see user in sidebar', async () => {
			await conversationsListPage.goto();
			await expect(page).toHaveURL(/\/conversations/);
			await conversationsListPage.expectLoaded();
			await sidebar.expectUserEmailVisible(email);
		});

		await test.step('04. Log out', async () => {
			await sidebar.logout();
			await expect(page).toHaveURL(/\/login/);
		});

		await test.step('05. Block private route after logout', async () => {
			await conversationsListPage.goto();
			await expect(page).toHaveURL(/\/login/);
		});
	});

	test('show an error and stay on login when the OTP is wrong', async ({
		page,
		loginPage
	}, testInfo) => {
		const email = emailForWorker(testInfo.workerIndex);
		const sidebar = createSidebarComponent(page);

		await test.step('01. Proceed to OTP step', async () => {
			await loginPage.proceedToOtpStep(email, { assumeOnLoginPage: true });
		});

		await test.step('02. Submit wrong OTP and stay on login', async () => {
			const correctCode = await resolveOtpCode(email);
			const wrongCode = wrongOtpCode(correctCode);
			await loginPage.fillOtp(wrongCode);
			await loginPage.submitOtp();
			await loginPage.expectErrorVisible();

			await expect(page).toHaveURL(/\/login/);
			await expect(sidebar.userEmail(email)).toHaveCount(0);
		});
	});

	test('send a new OTP and log in after a failed attempt', async ({ page, loginPage }, testInfo) => {
		const email = emailForWorker(testInfo.workerIndex);

		await test.step('01. Open login and proceed to OTP', async () => {
			await loginPage.goto();
			await loginPage.proceedToOtpStep(email, { assumeOnLoginPage: true });
		});

		await test.step('02. Fail once with wrong OTP', async () => {
			const correctCode = await resolveOtpCode(email);
			const wrongCode = wrongOtpCode(correctCode);

			await loginPage.fillOtp(wrongCode);
			await loginPage.submitOtp();
			await loginPage.expectErrorVisible();
		});

		await test.step('03. Log in with correct OTP', async () => {
			const correctCode = await resolveOtpCode(email);
			await loginPage.fillOtp(correctCode);
			await loginPage.submitOtp();
			await loginPage.waitForLoginSuccess();

			await expect(page).toHaveURL(/\/conversations/);
		});
	});

	test('send the Polish UI locale with the OTP request', async ({ page, loginPage }, testInfo) => {
		const email = emailForWorker(testInfo.workerIndex);

		await test.step('01. Set Polish locale cookie', async () => {
			await page.context().addCookies([
				{
					name: 'PARAGLIDE_LOCALE',
					value: 'pl',
					url: testEnv.baseUrl
				}
			]);
		});

		await test.step('02. Request OTP with locale in API payload', async () => {
			const otpRequest = page.waitForRequest(
				(request) => request.url().includes('/api/v1/auth/otp-request') && request.method() === 'POST'
			);

			await loginPage.proceedToOtpStep(email, { assumeOnLoginPage: true });

			expect((await otpRequest).postDataJSON()).toMatchObject({ email, locale: 'pl' });
			await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
		});
	});

	test('sign in from the email OTP link', async ({ page, loginPage }, testInfo) => {
		const email = emailForWorker(testInfo.workerIndex);

		await test.step('01. Open login and proceed to OTP', async () => {
			await loginPage.goto();
			await loginPage.proceedToOtpStep(email, { assumeOnLoginPage: true });
		});

		await test.step('02. Sign in from email link without query params', async () => {
			const code = await resolveOtpCode(email);

			await loginPage.openEmailSignInLink(email, code);
			await loginPage.waitForLoginSuccess();

			await expect(page).toHaveURL(/\/conversations/);
			expect(new URL(page.url()).searchParams.has('code')).toBe(false);
			expect(new URL(page.url()).searchParams.has('email')).toBe(false);
		});
	});

	test('redirect to login when the session cookie is gone on a private page', async ({
		page,
		loginPage
	}, testInfo) => {
		const email = emailForWorker(testInfo.workerIndex);
		const conversationsListPage = createConversationsListPage(page);

		await test.step('01. Ensure authenticated session on conversations', async () => {
			// Serial: reuse the authenticated session from the prior test when possible.
			await conversationsListPage.goto();
			if (/\/login/.test(page.url())) {
				await loginPage.loginWithOtp(email, undefined, { assumeOnLoginPage: true });
			}

			await expect(page).toHaveURL(/\/conversations/);
		});

		await test.step('02. Clear session and revisit private route', async () => {
			await page.context().clearCookies();
			await page.goto('/conversations');

			await expect(page).toHaveURL(/\/login/);
		});
	});
});
