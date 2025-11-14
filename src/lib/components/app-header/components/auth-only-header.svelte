<script lang="ts">
import { Avatar, Dropdown, DropdownItem } from 'flowbite-svelte';
import { ChevronDownOutline, CogSolid, OpenDoorSolid } from 'flowbite-svelte-icons';
import gravatarUrl from 'gravatar-url';
import { goto } from '$app/navigation';
import { createLogoutMutation } from '$lib/api-client/auth/mutations/use-logout-mutation';
import { m } from '$lib/paraglide/messages.js';
import { authStore } from '$lib/stores/auth.svelte';

const logoutMutation = createLogoutMutation();

const avatarUrl = $derived(
	authStore.user?.email ? gravatarUrl(authStore.user.email, { size: 80 }) : undefined
);

async function handleLogout() {
	await logoutMutation.mutateAsync();
	authStore.clearUser();
	goto('/login');
}

function handleSettings() {
	// Placeholder for settings functionality
	console.log('Settings clicked');
}
</script>

{#if authStore.isAuthenticated && authStore.user}
  <button
    class="p-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50
      focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600
      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600
      flex items-center gap-2"
    aria-label="User menu"
    type="button"
  >
    <Avatar src={avatarUrl} size="sm" />
    <span class="text-sm font-medium hidden sm:inline">{authStore.user.name}</span>
    <ChevronDownOutline class="w-3 h-3" />
  </button>

  <Dropdown
    class="w-64 bg-white dark:bg-gray-700 p-2 space-y-1"
  >
    <div class="px-2 py-4">
      <div class="flex items-center gap-3">
        <Avatar src={avatarUrl} size="md" />
        <div class="flex-1 min-w-0">
          <p class="text-md font-semibold text-gray-900 dark:text-white truncate">
            {authStore.user.name}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
            {authStore.user.email}
          </p>
        </div>
      </div>
    </div>

    <div class="space-y-1">
      <DropdownItem
        onclick={handleSettings}
        class="group w-full flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md cursor-pointer"
      >
        <CogSolid class="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span class="text-sm">{m['common.header.settings']()}</span>
      </DropdownItem>

      <DropdownItem
        onclick={handleLogout}
        class="group w-full flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md cursor-pointer"
      >
        <OpenDoorSolid class="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span class="text-sm">{m['common.header.logout']()}</span>
      </DropdownItem>
    </div>
  </Dropdown>
{/if}