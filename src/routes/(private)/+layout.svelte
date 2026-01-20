<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.svelte';
	import { PrivateLayout, AppLoadingScreen } from '$lib/features/app-layouts';

	const { children, data } = $props();

	onMount(() => {
		if (data.user) {
			authStore.setUser(data.user);
		} else {
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
