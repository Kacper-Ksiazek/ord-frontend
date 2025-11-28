// Export the configured axios instance

// Re-export all auth-related exports
export * from './auth';
export { api } from './axios';

// Re-export SSE utilities
export { createSSEStream, type SSEStreamType } from './utils/sse';
export type { SSEEvent, SSEStreamOptions, SSEStreamState } from './utils/sse.types';
