import { test, expect } from '../../fixtures/pages.fixture';

test.describe('Login — validation errors', () => {
	test('submit button is disabled when email has no @ symbol', async ({ loginPage }) => {
		await loginPage.goto();
		await loginPage.fillEmail('not-an-email');

		await expect(loginPage.emailSubmitButton).toBeDisabled();
	});

	test('submit button is disabled when email is cleared', async ({ loginPage }) => {
		await loginPage.goto();
		await loginPage.fillEmail('');

		await expect(loginPage.emailSubmitButton).toBeDisabled();
	});
});
