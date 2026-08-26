<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { Tooltip } from 'bits-ui';
	import faviconIco from '$lib/assets/favicon.ico';
	import faviconSvg from '$lib/assets/logo/favicon.svg?url';
	import '../app.css';

	const { children } = $props();

	// Create a single QueryClient for the entire app
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60, // 1 minute
				retry: 1
			}
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={faviconSvg} type="image/svg+xml" />
	<link rel="icon" href={faviconIco} sizes="32x32" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>

<QueryClientProvider client={queryClient}>
	<Tooltip.Provider delayDuration={200}>
		<div class="app-bg-col h-screen w-screen overflow-hidden">
			{@render children()}
		</div>
	</Tooltip.Provider>
</QueryClientProvider>
