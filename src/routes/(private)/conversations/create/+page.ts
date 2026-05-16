/**
 * Defaults for type/tone are read from localStorage synchronously on the client.
 * With SSR enabled, the server would always render step 1 while the client jumps to step 3 after mount, causing a visible flash.
 */
export const ssr = false;
