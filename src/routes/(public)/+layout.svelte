<script lang="ts">
	import AppLogo from '$lib/components/app-logo/app-logo.svelte';
	import ThemeSwitcher from '$lib/components/theme-switcher/theme-switcher.svelte';

	const { children } = $props();
</script>

<div class="flex flex-col h-screen">
	<header
		class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
	>
		<div class="container mx-auto px-4 h-16 flex items-center justify-between">
			<!-- Left Section: Logo -->
			<div class="flex items-center gap-2">
				<AppLogo size="md" />
				<span class="text-lg font-semibold text-gray-900 dark:text-gray-50">ORD</span>
			</div>

			<!-- Right Section: Controls -->
			<div class="flex items-center gap-4">
				<ThemeSwitcher />
			</div>
		</div>
	</header>

	<main class="flex-1 flex items-center justify-center overflow-auto">
		{@render children()}
	</main>
</div>
