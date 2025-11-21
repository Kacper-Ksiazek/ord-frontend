<script lang="ts">
import { page } from '$app/stores';
import AppLogo from '$lib/components/app-logo/app-logo.svelte';
</script>

<svelte:head>
	<title>Error</title>
</svelte:head>

<div class="flex flex-col h-screen">
	<!-- Header -->
	<header class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
		<div class="container mx-auto px-4 h-16 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<AppLogo size="md" />
				<span class="text-lg font-semibold text-gray-900 dark:text-gray-50">ORD</span>
			</div>
		</div>
	</header>

	<!-- Error Content -->
	<main class="flex-1 flex items-center justify-center px-4 py-12">
		<div class="text-center max-w-md">
			<!-- Error Code -->
			<div class="mb-6">
				<h1 class="text-7xl font-bold text-primary-600 dark:text-primary-400 mb-2">
					{$page.status}
				</h1>
				<p class="text-xl font-semibold text-gray-900 dark:text-gray-50">
					{#if $page.status === 404}
						Page Not Found
					{:else if $page.status === 500}
						Server Error
					{:else}
						An Error Occurred
					{/if}
				</p>
			</div>

			<!-- Error Message -->
			<p class="text-gray-600 dark:text-gray-400 mb-8">
				{#if $page.status === 404}
					The page you're looking for doesn't exist. It might have been moved or deleted.
				{:else if $page.status === 500}
					Something went wrong on our end. Please try again later.
				{:else}
					{$page.error?.message || 'An unexpected error occurred.'}
				{/if}
			</p>

			<!-- Action Buttons -->
			<div class="flex flex-col gap-3">
				<a
					href="/login"
					class="inline-flex items-center justify-center px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
				>
					Back to Login
				</a>
				<button
					onclick={() => window.history.back()}
					class="inline-flex items-center justify-center px-6 py-2.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-50 font-medium rounded-lg transition-colors"
				>
					Go Back
				</button>
			</div>
		</div>
	</main>
</div>

<style>
	:global(body) {
		background-color: hsl(var(--color-gray-50) / 1);
	}

	:global(.dark body) {
		background-color: hsl(var(--color-gray-900) / 1);
	}
</style>
