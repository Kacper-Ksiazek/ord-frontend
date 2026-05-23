<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Features/AppLayouts/ThemeSwitcher'
	});
</script>

<script lang="ts">
	import ThemeSwitcher from './theme-switcher.svelte';
	import { themeStore } from '$lib/stores/theme.svelte';
</script>

<Story name="Default">
	<div class="p-8 bg-white dark:bg-gray-800 min-h-screen transition-colors">
		<div class="max-w-md mx-auto">
			<h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Theme Switcher</h2>
			<p class="mb-6 text-gray-600 dark:text-gray-300">
				Click the button to toggle between light and dark mode
			</p>

			<ThemeSwitcher />

			<div class="mt-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
				<p class="text-sm text-gray-700 dark:text-gray-300">
					Current theme: <strong>{themeStore.theme}</strong>
				</p>
			</div>
		</div>
	</div>
</Story>
