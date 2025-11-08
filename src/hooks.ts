import { deLocalizeUrl } from '$lib/paraglide/runtime';

// biome-ignore lint/suspicious/noTsIgnore: SvelteKit provides the correct type at runtime, but tsc doesn't infer it
// @ts-ignore
export const reroute = (request) => deLocalizeUrl(request.url).pathname;
