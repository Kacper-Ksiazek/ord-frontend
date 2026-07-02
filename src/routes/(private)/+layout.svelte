<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.svelte';
	import { PrivateLayout, AppLoadingScreen } from '$lib/features/app-layouts';

	const { children, data } = $props();

	// Sync auth as soon as layout data is available — onMount was too late for fast headless runs.
	$effect(() => {
		if (data.user) {
			authStore.setUser(data.user);
			return;
		}

		if (data.user === null) {
			authStore.clearUser();
			goto('/login');
		}
	});
</script>

{#if authStore.user}
	<PrivateLayout>
		{@render children()}
	</PrivateLayout>
{:else}
	<AppLoadingScreen />
{/if}
