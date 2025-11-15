<script lang="ts">
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
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
	{@render children()}
{:else}
	<div class="h-full flex items-center justify-center">
		<p class="text-gray-600">Loading...</p>
	</div>
{/if}
