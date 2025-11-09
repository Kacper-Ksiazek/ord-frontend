<script lang="ts">
import '../app.css';
import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
import favicon from '$lib/assets/favicon.ico';

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
	{@render children()}
</QueryClientProvider>


