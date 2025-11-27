<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Error</title>
</svelte:head>

<div class="flex flex-col items-center justify-center h-full px-4">
	<!-- Error Content -->
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
				The page you're looking for doesn't exist. Try navigating from the sidebar or go back to the
				home page.
			{:else if $page.status === 500}
				Something went wrong on our end. Please try again later.
			{:else}
				{$page.error?.message || 'An unexpected error occurred.'}
			{/if}
		</p>

		<!-- Action Buttons -->
		<div class="flex flex-col gap-3">
			<button
				onclick={() => goto('/')}
				class="inline-flex items-center justify-center px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
			>
				Go to Home
			</button>
			<button
				onclick={() => window.history.back()}
				class="inline-flex items-center justify-center px-6 py-2.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-50 font-medium rounded-lg transition-colors"
			>
				Go Back
			</button>
		</div>
	</div>
</div>
