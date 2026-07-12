<script lang="ts">
	import { goto } from '$app/navigation';
	import type { UserDTO } from '$auth/types';
	import { authStore } from '$auth/stores';
	import { PrivateLayout, AppLoadingScreen } from '$lib/features/app-layouts';
	import type { Snippet } from 'svelte';

	interface PrivateAuthLayoutProps {
		user: UserDTO | null;
		children: Snippet;
	}

	const { user, children }: PrivateAuthLayoutProps = $props();

	$effect(() => {
		if (user) {
			authStore.setUser(user);

			return;
		}

		if (user === null) {
			authStore.clearUser();
			goto('/login');
		}
	});
</script>

{#if user}
	<PrivateLayout>
		{@render children()}
	</PrivateLayout>
{:else}
	<AppLoadingScreen />
{/if}
