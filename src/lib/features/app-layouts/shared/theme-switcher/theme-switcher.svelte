<script lang="ts">
	import clsx from 'clsx';
	import { Moon, Sun } from 'lucide-svelte';
	import { browser } from '$app/environment';
	import { themeStore } from '$lib/stores/theme.svelte';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	function handleClick(event: MouseEvent) {
		themeStore.toggle();
		(event.currentTarget as HTMLButtonElement).blur();
	}

	let mounted = $state(false);
	let isDarkMode = $state(false);

	$effect(() => {
		if (browser) {
			mounted = true;
			isDarkMode = document.documentElement.classList.contains('dark');
		}
	});

	$effect(() => {
		if (mounted) {
			isDarkMode = themeStore.isDark;
		}
	});
</script>

<button
	onclick={handleClick}
	class={clsx(
		`p-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50
		focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600
		dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600`,
		className
	)}
	aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
	type="button"
>
	{#if mounted}
		{#if isDarkMode}
			<Sun class="w-5 h-5" />
		{:else}
			<Moon class="w-5 h-5" />
		{/if}
	{:else}
		<!-- Placeholder to prevent layout shift during SSR -->
		<div class="w-5 h-5"></div>
	{/if}
</button>
