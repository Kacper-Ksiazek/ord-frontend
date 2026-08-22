<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { Tooltip } from 'bits-ui';
	import favicon from '$lib/assets/favicon.ico';
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
	<link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={queryClient}>
	<Tooltip.Provider delayDuration={200}>
		<div class="app-bg-col h-screen w-screen overflow-hidden">
			{@render children()}
		</div>
	</Tooltip.Provider>
</QueryClientProvider>
