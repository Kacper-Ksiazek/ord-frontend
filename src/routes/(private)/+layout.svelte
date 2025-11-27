<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Sidebar } from '$lib/components/sidebar';
	import { authStore } from '$lib/stores/auth.svelte';

	const { children, data } = $props();

	onMount(() => {
		// Update auth store with user data from load function
		if (data.user) {
			authStore.setUser(data.user);
		} else {
			// If no user data, redirect to login
			authStore.clearUser();
			goto('/login');
		}
	});
</script>

{#if authStore.user}
	<div class="flex h-screen">
		<Sidebar />
		<main class="flex-1 overflow-auto p-4">
			{@render children()}
		</main>
	</div>
{:else}
	<div class="h-full flex items-center justify-center">
		<p class="text-gray-600">Loading...</p>
	</div>
{/if}
