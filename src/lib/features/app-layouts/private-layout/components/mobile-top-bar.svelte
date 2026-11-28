<script lang="ts">
	import { Menu } from 'lucide-svelte';
	import { AppLogo } from '$lib/components/app-logo';
	import * as m from '$lib/paraglide/messages.js';
	import { sidebarStore } from './sidebar/sidebar.store.svelte';
</script>

<header
	class="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-line bg-canvas px-2 md:hidden"
>
	<button
		type="button"
		onclick={() => sidebarStore.openMobile()}
		class="cursor-pointer rounded-control p-2.5 text-ink transition-colors hover:bg-accent-soft"
		aria-label={m['features.app-layouts.mobile-navigation.open_menu']()}
		aria-controls="app-sidebar"
		aria-expanded={sidebarStore.isMobileOpen}
	>
		<Menu class="h-5 w-5" />
	</button>

	<a href="/" class="flex items-center gap-2 text-ink">
		<AppLogo size="sm" class="text-ink" />
		<span class="text-lg font-medium">ORD</span>
	</a>
</header>
