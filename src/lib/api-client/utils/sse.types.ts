/**
 * Options for configuring SSE stream behavior
 */
export interface SSEStreamOptions {
	/**
	 * HTTP method to use for the request (default: 'GET')
	 */
	method: 'GET' | 'POST';

	/**
	 * Request body for POST requests
	 */
	body?: Record<string, unknown> | unknown;

	/**
	 * Query parameters to append to the SSE endpoint URL
	 */
	params?: Record<string, string>;

	/**
	 * Custom event parser function
	 * If not provided, will try to parse as JSON, fallback to string
	 * @param event - The raw SSE event data
	 * @returns Parsed event data
	 */
	parser?: (event: string) => unknown;
}

/**
 * Generic SSE Event type for strongly typed streams
 */
export interface SSEEvent<T> {
	data: T;
	id?: string;
	timestamp: number;
}

/**
 * SSE Stream state interface
 */
export interface SSEStreamState<T> {
	isConnected: boolean;
	messageCount: number;
	lastMessage?: T;
	error?: Error;
}
