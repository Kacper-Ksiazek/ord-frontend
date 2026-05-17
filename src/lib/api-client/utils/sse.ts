import { Observable } from 'rxjs';
import { PUBLIC_API_URL } from '$env/static/public';
import type { SSEStreamOptions } from './sse.types';

export function createSSEStream<T = unknown>(
	endpoint: string,
	options?: SSEStreamOptions
): Observable<T> {
	return new Observable((subscriber) => {
		let controller: AbortController | null = null;

		(async () => {
			try {
				// Build the full URL
				const url = new URL(endpoint, PUBLIC_API_URL);

				// Add query parameters if provided
				if (options?.params) {
					Object.entries(options.params).forEach(([key, value]) => {
						url.searchParams.append(key, value);
					});
				}

				// Create abort controller for cleanup
				controller = new AbortController();

				const method = options?.method ?? 'GET';

				// Build fetch options
				const fetchOptions: RequestInit = {
					method,
					credentials: 'include',
					signal: controller.signal,
					headers: {
						Accept: 'text/event-stream'
					}
				};

				// Add body for POST requests
				if (method === 'POST' && options?.body) {
					fetchOptions.headers = {
						...fetchOptions.headers,
						'Content-Type': 'application/json'
					};
					fetchOptions.body = JSON.stringify(options.body);
				}

				// Fetch with credentials to include cookies
				const response = await fetch(url.toString(), fetchOptions);

				if (!response.ok) {
					throw new Error(
						`SSE connection failed with status ${response.status}: ${response.statusText}`
					);
				}

				if (!response.body) {
					throw new Error('Response body is empty');
				}

				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				let buffer = '';

				// Process the stream
				while (true) {
					const { done, value } = await reader.read();

					if (done) {
						// Process any remaining data in buffer
						if (buffer.trim()) {
							processMessage(buffer.trim());
						}
						subscriber.complete();
						break;
					}

					// Append new data to buffer
					buffer += decoder.decode(value, { stream: true });

					// Process complete lines
					const lines = buffer.split('\n');

					// Keep the last incomplete line in the buffer
					buffer = lines.pop() || '';

					for (const line of lines) {
						if (line.trim()) {
							processMessage(line.trim());
						}
					}
				}

				function processMessage(line: string) {
					try {
						const rawData = line;

						let parsedData: T;

						// Use custom parser if provided
						if (options?.parser) {
							parsedData = options.parser(rawData) as T;
						} else {
							// Try to parse as JSON, fallback to string
							try {
								parsedData = JSON.parse(rawData.replaceAll('data:', '')) as T;
							} catch {
								parsedData = rawData.replaceAll('data:', '') as T;
							}
						}

						subscriber.next(parsedData);
					} catch (parseError) {
						subscriber.error(parseError);
					}
				}
			} catch (error) {
				if (error instanceof Error && error.name === 'AbortError') {
					return;
				}

				subscriber.error(error);
			}
		})();

		// Return cleanup function (called on unsubscribe)
		return () => {
			if (controller) {
				controller.abort();
			}
		};
	});
}

/**
 * Utility type to extract the emitted type from an SSE stream Observable
 * @example
 * type MessageType = SSEStreamType<typeof messageStream>;
 */
export type SSEStreamType<T> = T extends Observable<infer U> ? U : never;
