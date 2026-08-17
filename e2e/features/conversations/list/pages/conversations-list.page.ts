import { expect, type Locator, type Page } from '@playwright/test';
import type { ConversationType } from '$conversations/types';
import { E2E_TEST_IDS } from '@e2e/conversations/test-ids';
import { E2E_TEST_IDS as APP_LAYOUTS_E2E_TEST_IDS } from '@e2e/app-layouts/test-ids';

export class ConversationsListPage {
	readonly path = '/conversations';

	readonly heading: Locator;
	readonly list: Locator;
	readonly newButton: Locator;
	readonly filters: Locator;
	readonly filterSearch: Locator;
	readonly filterType: Locator;
	readonly filterClear: Locator;

	constructor(protected readonly page: Page) {
		this.heading = page.getByTestId(E2E_TEST_IDS.conversations.heading);
		this.list = page.getByTestId(E2E_TEST_IDS.conversations.list);
		this.newButton = page.getByTestId(E2E_TEST_IDS.conversations.newButton);
		this.filters = page.getByTestId(E2E_TEST_IDS.conversations.filters);
		this.filterSearch = page.getByTestId(E2E_TEST_IDS.conversations.filterSearch);
		this.filterType = page.getByTestId(E2E_TEST_IDS.conversations.filterType);
		this.filterClear = page.getByTestId(E2E_TEST_IDS.conversations.filterClear);
	}

	conversationRow(id: string): Locator {
		return this.page.getByTestId(E2E_TEST_IDS.conversations.row(id));
	}

	conversationRows(): Locator {
		return this.page.locator('[data-testid^="conversation-row-"]');
	}

	async goto(): Promise<void> {
		await this.page.goto(this.path);
	}

	async expectLoaded(): Promise<void> {
		await this.page.getByTestId(APP_LAYOUTS_E2E_TEST_IDS.sidebar.root).waitFor({ state: 'visible' });
		await this.heading.waitFor({ state: 'visible' });
	}

	async expectFiltersVisible(): Promise<void> {
		await this.filters.waitFor({ state: 'visible' });
	}

	async expectHasConversationRow(id: string): Promise<void> {
		await this.conversationRow(id).waitFor({ state: 'visible' });
	}

	async expectListOrEmptyState(): Promise<void> {
		await this.page
			.getByTestId(E2E_TEST_IDS.conversations.list)
			.or(this.page.getByTestId(E2E_TEST_IDS.conversations.noMatches))
			.or(this.page.getByRole('heading', { name: 'No conversations yet' }))
			.first()
			.waitFor({ state: 'visible' });
	}

	async expectConversationRowCount(count: number): Promise<void> {
		await expect(this.conversationRows()).toHaveCount(count);
	}

	async fillSearchFilter(search: string): Promise<void> {
		await this.filterSearch.fill(search);
		await expect
			.poll(() => new URL(this.page.url()).searchParams.get('search'), { timeout: 8_000 })
			.toBe(search);
	}

	async selectTypeFilter(type: ConversationType): Promise<void> {
		await this.filterType.click();
		await this.page.getByTestId(E2E_TEST_IDS.conversations.filterTypeOption(type)).click();
		await expect
			.poll(() => new URL(this.page.url()).searchParams.get('type'), { timeout: 8_000 })
			.toBe(type);
	}

	async clickClearFilters(): Promise<void> {
		await this.filterClear.click();
	}

	noMatchesPanel(): Locator {
		return this.page.getByTestId(E2E_TEST_IDS.conversations.noMatches);
	}

	async clickNoMatchesClearFilters(): Promise<void> {
		await this.noMatchesPanel().getByRole('button').click();
	}

	async expectNoMatchesState(): Promise<void> {
		await expect(this.noMatchesPanel()).toBeVisible();
		await expect(this.list).toHaveCount(0);
	}

	async expectUrlFilters(filters: { search?: string; type?: ConversationType }): Promise<void> {
		await expect
			.poll(
				() => {
					const url = new URL(this.page.url());

					if (filters.search !== undefined) {
						const search = url.searchParams.get('search') ?? '';

						if (search !== filters.search) {
							return false;
						}
					}

					if (filters.type !== undefined) {
						if (url.searchParams.get('type') !== filters.type) {
							return false;
						}
					}

					return true;
				},
				{ timeout: 8_000 }
			)
			.toBe(true);
	}

	async clickNewConversation(): Promise<void> {
		await this.newButton.click();
	}

	async openConversation(id: string): Promise<void> {
		await this.conversationRow(id).click();
	}
}

export function createConversationsListPage(page: Page): ConversationsListPage {
	return new ConversationsListPage(page);
}
