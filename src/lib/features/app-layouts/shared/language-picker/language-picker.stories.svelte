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
	<div class="p-8 bg-surface min-h-screen transition-colors">
		<div class="max-w-md mx-auto">
			<h2 class="text-2xl font-bold mb-4 text-ink">Language Picker</h2>
			<p class="mb-6 text-ink-muted">Click to cycle through available languages (EN → PL → DE)</p>

			<LanguagePicker />

			<div class="mt-6 p-4 rounded-lg bg-accent-soft">
				<p class="text-sm text-ink-body">
					Current language: <strong>{currentLocale}</strong>
				</p>
			</div>
		</div>
	</div>
</Story>
