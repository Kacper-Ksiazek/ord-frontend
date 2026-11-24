<script lang="ts">
	import { page } from '$app/state';
	import AppLogo from '$lib/components/app-logo/app-logo.svelte';

	interface Props {
		homeHref: string;
		homeLabel: string;
		showHeader?: boolean;
		notFoundMessage?: string;
	}

	const { homeHref, homeLabel, showHeader = true, notFoundMessage }: Props = $props();

	const defaultNotFoundMessage = $derived(
		showHeader
			? "The page you're looking for doesn't exist. It might have been moved or deleted."
			: "The page you're looking for doesn't exist. Try navigating from the sidebar or go back to the home page."
	);

	const resolvedNotFoundMessage = $derived(notFoundMessage ?? defaultNotFoundMessage);
</script>

<svelte:head>
	<title>Error</title>
</svelte:head>

<div class="flex flex-col {showHeader ? 'h-screen' : 'h-full items-center justify-center'}">
	{#if showHeader}
		<header class="sticky top-0 z-50 border-b border-line bg-surface">
			<div class="container mx-auto px-4 h-16 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<AppLogo size="md" />
					<span class="text-lg font-semibold text-ink">ORD</span>
				</div>
			</div>
		</header>
	{/if}

	<main class="flex-1 flex items-center justify-center px-4 py-12">
		<div class="text-center max-w-md">
			<div class="mb-6">
				<h1 class="text-7xl font-bold text-ink mb-2">
					{page.status}
				</h1>
				<p class="text-xl font-semibold text-ink">
					{#if page.status === 404}
						Page Not Found
					{:else if page.status === 500}
						Server Error
					{:else}
						An Error Occurred
					{/if}
				</p>
			</div>

			<p class="text-ink-muted mb-8">
				{#if page.status === 404}
					{resolvedNotFoundMessage}
				{:else if page.status === 500}
					Something went wrong on our end. Please try again later.
				{:else}
					{page.error?.message || 'An unexpected error occurred.'}
				{/if}
			</p>

			<div class="flex flex-col gap-3">
				<a
					href={homeHref}
					class="inline-flex items-center justify-center px-6 py-2.5 border border-ink bg-ink text-on-ink hover:opacity-90 font-medium rounded-control transition-[background-color,border-color,color,opacity] duration-150"
				>
					{homeLabel}
				</a>
				<button
					onclick={() => window.history.back()}
					class="inline-flex items-center justify-center px-6 py-2.5 border border-transparent bg-accent-soft hover:bg-line text-ink font-medium rounded-control transition-colors"
				>
					Go Back
				</button>
			</div>
		</div>
	</main>
</div>
