import type { Page } from '@playwright/test';
import { testEnv } from '@e2e/shared/fixtures/test-env';
import type { ApiRequestInit } from './api-client.types';

export async function apiFetch<T>(page: Page, path: string, init: ApiRequestInit = {}): Promise<T> {
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
				return null as T;
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
