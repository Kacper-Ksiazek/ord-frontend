<script lang="ts">
import { MoonSolid, SunSolid } from 'flowbite-svelte-icons';
import { themeStore } from '$lib/stores/theme.svelte';

function handleClick(event: MouseEvent) {
	themeStore.toggle();
	(event.currentTarget as HTMLButtonElement).blur();
}
</script>

<button
	onclick={handleClick}
	class="p-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50
		focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600
		dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
	aria-label={themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'}
	type="button"
>
	{#if themeStore.isDark}
		<SunSolid class="w-5 h-5" />
	{:else}
		<MoonSolid class="w-5 h-5" />
	{/if}
</button>
