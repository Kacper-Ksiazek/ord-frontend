<script lang="ts">
	import { ThemeSwitcher } from '$appLayouts/shared';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors p-6">
	<header class="fixed top-4 right-4 z-10">
		<ThemeSwitcher />
	</header>

	<div class="max-w-7xl mx-auto pt-12">
		{@render children()}
	</div>
</div>
