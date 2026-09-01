<script lang="ts">
	import type { Snippet } from 'svelte';
	import { AppLogo } from '$lib/components/app-logo';
	import { LanguagePicker, ThemeSwitcher } from '../shared';

	interface Props {
		showHeader?: boolean;
		children: Snippet;
	}

	const { showHeader = true, children }: Props = $props();
</script>

<div class="flex flex-col h-screen">
	{#if showHeader}
		<header class="sticky top-0 z-50">
			<div class="container mx-auto px-4 h-16 flex items-center justify-between">
				<!-- Left Section: Logo -->
				<div class="flex items-center gap-2">
					<AppLogo size="md" />
					<span class="text-lg font-semibold text-ink">ORD</span>
				</div>

				<!-- Right Section: Controls -->
				<div class="flex items-center gap-2">
					<LanguagePicker />
					<ThemeSwitcher />
				</div>
			</div>
		</header>
	{/if}

	<main class="flex-1 flex items-center justify-center overflow-auto">
		{@render children()}
	</main>
</div>
