<script lang="ts">
import '../app.css';
import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
import { PUBLIC_API_URL } from '$env/static/public';
import favicon from '$lib/assets/favicon.ico';

async function demoAPICallFunction() {
	console.time('demoAPICallFunction');
	const response = await fetch(`${PUBLIC_API_URL}/api/v1/health-check`);
	const data = await response.json();
	console.timeEnd('demoAPICallFunction');

	console.log({ data });
}

const { children } = $props();

// Create a client
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
	<div class="flex h-screen w-screen items-center justify-center flex-col">
		<strong>API URL: {PUBLIC_API_URL}</strong>

		<button onclick={demoAPICallFunction} class="bg-blue-500 text-white p-2 rounded-md"
			>Demo API Call</button>

		{@render children()}
	</div>
</QueryClientProvider>


