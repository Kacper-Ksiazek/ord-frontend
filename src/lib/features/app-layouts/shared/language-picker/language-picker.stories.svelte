<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Features/AppLayouts/LanguagePicker'
	});
</script>

<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import LanguagePicker from './language-picker.svelte';

	const currentLocale = $derived(getLocale());
</script>

<Story name="Default">
	<div class="p-8 bg-white dark:bg-gray-800 min-h-screen transition-colors">
		<div class="max-w-md mx-auto">
			<h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Language Picker</h2>
			<p class="mb-6 text-gray-600 dark:text-gray-300">
				Click to cycle through available languages (EN → PL → DE)
			</p>

			<LanguagePicker />

			<div class="mt-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
				<p class="text-sm text-gray-700 dark:text-gray-300">
					Current language: <strong>{currentLocale}</strong>
				</p>
			</div>
		</div>
	</div>
</Story>
