<script lang="ts">
import '../app.css';
import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
import favicon from '$lib/assets/favicon.ico';
import { AppHeader } from '$lib/components/app-header';

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
	<div class="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 w-screen">
		<AppHeader />
		<main class="flex-1 overflow-auto">
			{@render children()}
		</main>
	</div>
</QueryClientProvider>


