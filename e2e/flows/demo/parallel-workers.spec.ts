import { test, expect } from '../../fixtures/auth.fixture';
import { isE2eAuthConfigured, workerEmail } from '../../fixtures/test-env';
import { fetchCurrentUser, listConversations } from '../../helpers/api';
import { seedConversationViaApi } from '../../helpers/conversations';

/**
 * Demo: 3 Playwright workers × 3 isolated E2E accounts.
 *
 * Run:
 *   bun run test:e2e:parallel-demo
 *
 * Requires ord-api with Flyway V22 worker users + OTP whitelist (docker-compose.e2e.yml).
 */
test.describe.configure({ mode: 'parallel' });

const DEMO_WORKERS = [0, 1, 2] as const;

for (const slot of DEMO_WORKERS) {
	test(`parallel slot ${slot} — dedicated account + isolated conversations`, async ({
		authenticatedPage
	}, testInfo) => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');

		const workerIndex = testInfo.workerIndex;
		const expectedEmail = workerEmail(workerIndex);
		const marker = `parallel-demo-w${workerIndex}-${Date.now()}`;

		const me = await fetchCurrentUser(authenticatedPage);
		expect(me.email, `Playwright workerIndex=${workerIndex}`).toBe(expectedEmail);

		const { id: seededId } = await seedConversationViaApi(authenticatedPage, {
			topic: marker
		});

		const conversations = await listConversations(authenticatedPage);
		const topics = conversations.map((row) => row.topic);

		expect(
			conversations.some((row) => row.id === seededId),
			`seeded conversation visible for ${expectedEmail}`
		).toBe(true);

		for (const otherIndex of DEMO_WORKERS) {
			if (otherIndex === workerIndex) {
				continue;
			}

			const foreignMarkerPrefix = `parallel-demo-w${otherIndex}-`;
			const leaked = topics.some((topic) => topic.startsWith(foreignMarkerPrefix));
			expect(leaked, `no data leak from worker ${otherIndex} into ${expectedEmail}`).toBe(false);
		}
	});
}
