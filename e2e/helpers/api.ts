import type { Page } from '@playwright/test';
import { testEnv } from '../fixtures/test-env';

type ApiRequestInit = {
	method?: string;
	body?: unknown;
};

async function apiFetch<T>(page: Page, path: string, init: ApiRequestInit = {}): Promise<T> {
	return page.evaluate(
		async ({ apiUrl, requestPath, requestInit }) => {
			const response = await fetch(`${apiUrl}${requestPath}`, {
				method: requestInit.method ?? 'GET',
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					...(requestInit.body ? { 'Content-Type': 'application/json' } : {})
				},
				body: requestInit.body ? JSON.stringify(requestInit.body) : undefined
			});

			if (!response.ok) {
				throw new Error(`${response.status}: ${await response.text()}`);
			}

			if (response.status === 204) {
				return null;
			}

			return (await response.json()) as T;
		},
		{
			apiUrl: testEnv.apiUrl,
			requestPath: path,
			requestInit: init
		}
	);
}

type MeResponse = {
	email: string;
};

type ConversationListItem = {
	id: string;
	topic: string;
};

export async function fetchCurrentUser(page: Page): Promise<MeResponse> {
	return apiFetch<MeResponse>(page, '/api/v1/users/me');
}

export async function listConversations(page: Page): Promise<ConversationListItem[]> {
	return apiFetch<ConversationListItem[]>(page, '/api/v1/conversations/');
}
