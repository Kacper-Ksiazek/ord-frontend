import { test, expect } from '@e2e/shared/fixtures/auth.fixture';
import { emailForWorker, isE2eAuthConfigured } from '@e2e/shared/fixtures/test-env';
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

		await conversationsListPage.goto();
		await expect(page).toHaveURL(/\/login/);

		await loginPage.loginWithOtp(email, undefined, { assumeOnLoginPage: true });

		await conversationsListPage.goto();
		await expect(page).toHaveURL(/\/conversations/);
		await conversationsListPage.expectLoaded();
		await sidebar.expectUserEmailVisible(email);

		await sidebar.logout();
		await expect(page).toHaveURL(/\/login/);

		await conversationsListPage.goto();
		await expect(page).toHaveURL(/\/login/);
	});

	test('show an error and stay on login when the OTP is wrong', async ({
		page,
		loginPage
	}, testInfo) => {
		const email = emailForWorker(testInfo.workerIndex);
		const sidebar = createSidebarComponent(page);

		await loginPage.goto();
		await loginPage.proceedToOtpStep(email, { assumeOnLoginPage: true });
		const correctCode = await resolveOtpCode(email);
		const wrongCode = wrongOtpCode(correctCode);
		await loginPage.fillOtp(wrongCode);
		await loginPage.submitOtp();
		await loginPage.expectErrorVisible();

		await expect(page).toHaveURL(/\/login/);
		await expect(sidebar.userEmail(email)).toHaveCount(0);
	});

	test('send a new OTP and log in after a failed attempt', async ({ page, loginPage }, testInfo) => {
		const email = emailForWorker(testInfo.workerIndex);

		await loginPage.goto();
		await loginPage.proceedToOtpStep(email, { assumeOnLoginPage: true });
		const correctCode = await resolveOtpCode(email);
		const wrongCode = wrongOtpCode(correctCode);

		await loginPage.fillOtp(wrongCode);
		await loginPage.submitOtp();
		await loginPage.expectErrorVisible();

		await loginPage.fillOtp(correctCode);
		await loginPage.submitOtp();
		await loginPage.waitForLoginSuccess();

		await expect(page).toHaveURL(/\/conversations/);
	});

	test('redirect to login when the session cookie is gone on a private page', async ({
		page,
		loginPage
	}, testInfo) => {
		const email = emailForWorker(testInfo.workerIndex);

		// Serial: previous test already leaves an authenticated session on /conversations.
		if (!page.url().includes('/conversations')) {
			await loginPage.loginWithOtp(email);
		}

		await expect(page).toHaveURL(/\/conversations/);

		await page.context().clearCookies();
		await page.goto('/conversations');

		await expect(page).toHaveURL(/\/login/);
	});
});
