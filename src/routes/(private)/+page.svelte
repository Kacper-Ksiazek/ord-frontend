<script lang="ts">
import { Avatar, Button, Card } from 'flowbite-svelte';
import { goto } from '$app/navigation';
import { createLogoutMutation } from '$lib/api-client/auth/mutations';
import { authStore } from '$lib/stores/auth.svelte';

const logoutMutation = createLogoutMutation();

async function handleLogout() {
	try {
		await logoutMutation.mutateAsync();

		// Clear auth store and localStorage
		authStore.clearUser();

		// Redirect to login
		goto('/login');
	} catch (error) {
		console.error('Logout failed:', error);
		// Even if logout fails, clear local state
		authStore.clearUser();
		goto('/login');
	}
}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-2xl mx-auto">
		<Card size="xl" class="shadow-lg">
			<div class="flex items-center justify-between mb-6">
				<h1 class="text-3xl font-bold text-gray-900">Welcome!</h1>
				<Button color="red" onclick={handleLogout} disabled={logoutMutation.isPending}>
					{logoutMutation.isPending ? 'Logging out...' : 'Logout'}
				</Button>
			</div>

			{#if authStore.user}
				<div class="space-y-4">
					<div class="flex items-center space-x-4 pb-4 border-b">
						<Avatar size="lg" />
						<div>
							<h2 class="text-xl font-semibold text-gray-900">
								{authStore.user.name || 'User'}
							</h2>
							<p class="text-gray-600">{authStore.user.email}</p>
						</div>
					</div>

					<div class="pt-4">
						<h3 class="text-lg font-semibold text-gray-900 mb-2">Profile Information</h3>
						<dl class="space-y-2">
							<div class="flex justify-between">
								<dt class="text-gray-600">Email:</dt>
								<dd class="font-medium text-gray-900">{authStore.user.email}</dd>
							</div>
							{#if authStore.user.name}
								<div class="flex justify-between">
									<dt class="text-gray-600">Name:</dt>
									<dd class="font-medium text-gray-900">{authStore.user.name}</dd>
								</div>
							{/if}
							{#if authStore.user.nativeLanguage}
								<div class="flex justify-between">
									<dt class="text-gray-600">Native Language:</dt>
									<dd class="font-medium text-gray-900">{authStore.user.nativeLanguage}</dd>
								</div>
							{/if}
							{#if authStore.user.selectedLearningLanguage}
								<div class="flex justify-between">
									<dt class="text-gray-600">Learning Language:</dt>
									<dd class="font-medium text-gray-900">{authStore.user.selectedLearningLanguage}</dd>
								</div>
							{/if}
						</dl>
					</div>
				</div>
			{:else}
				<p class="text-gray-600">Loading user information...</p>
			{/if}
		</Card>
	</div>
</div>
