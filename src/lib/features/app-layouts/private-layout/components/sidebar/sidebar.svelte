<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		LogIn,
		BookOpen,
		House,
		ChevronLeft,
		ChevronRight,
		Settings,
		Gamepad2,
		MessageSquare,
		Moon,
		Sun,
		X
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { authStore } from '$auth/stores';
	import { AuthUserAvatar } from '$auth/components';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { AppLogo } from '$lib/components/app-logo';
	import { Divider } from '$lib/components/utils/divider';
	import SidebarLearningLanguage from './components/sidebar-learning-language.svelte';
	import SidebarLink from './components/sidebar-link.svelte';
	import { sidebarStore } from './sidebar.store.svelte';
	import { createLogoutMutation } from '$auth/api-client';
	import { afterNavigate, goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$appLayouts/testing/test-ids';
	import { ExplainPhrasePopover } from '$aiExplainer';
	import { CaptureWordsPopover } from '$words';

	const { mutateAsync: handleLogout } = createLogoutMutation();

	onMount(() => {
		const stored = localStorage.getItem('sidebar-expanded');
		if (stored !== null) {
			sidebarStore.isExpanded = stored === 'true';
		}
	});

	afterNavigate(() => {
		sidebarStore.closeMobile();
	});

	$effect(() => {
		if (!sidebarStore.isMobile) sidebarStore.closeMobile();
	});

	function onWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && sidebarStore.isMobileOpen) sidebarStore.closeMobile();
	}

	function toggleSidebar() {
		sidebarStore.toggleExpanded();
		localStorage.setItem('sidebar-expanded', String(sidebarStore.isExpanded));
	}

	async function onLogoutClick() {
		await handleLogout();
		authStore.clearUser();
		goto('/login');
	}

	const sidebarWidth = $derived(sidebarStore.isExpanded ? 'md:w-60' : 'md:w-16');
	const isHiddenDrawer = $derived(sidebarStore.isMobile && !sidebarStore.isMobileOpen);
</script>

<svelte:window onkeydown={onWindowKeydown} />

{#if sidebarStore.isMobileOpen}
	<button
		type="button"
		class="fixed inset-0 z-40 bg-ink/40 md:hidden"
		aria-label={m['features.app-layouts.mobile-navigation.close_menu']()}
		onclick={() => sidebarStore.closeMobile()}
		transition:fade={{ duration: 150 }}
	></button>
{/if}

<aside
	id="app-sidebar"
	data-testid={E2E_TEST_IDS.sidebar.root}
	inert={isHiddenDrawer}
	class={cn(
		'h-dvh bg-canvas text-ink flex flex-col',
		'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] shadow-overlay transition-transform duration-300',
		sidebarStore.isMobileOpen ? 'translate-x-0' : '-translate-x-full',
		'md:static md:z-40 md:max-w-none md:translate-x-0 md:shadow-none md:transition-all',
		sidebarWidth,
		'overflow-y-auto overflow-x-hidden border-r border-line pb-4 md:overflow-hidden'
	)}
>
	<!-- Header Section with Logo -->
	<div class="flex items-center justify-between px-3 row-reverse min-h-[74px]">
		{#if sidebarStore.showsLabels}
			<div class="flex items-center justify-center h-12 shrink-0 gap-2" in:fade={{ delay: 150 }}>
				<AppLogo size="sm" class="text-ink" />
				<span class="text-lg font-medium text-ink">ORD</span>
			</div>
		{/if}

		<button
			data-testid={E2E_TEST_IDS.sidebar.toggle}
			aria-expanded={sidebarStore.isExpanded}
			onclick={toggleSidebar}
			class="hidden cursor-pointer rounded-control p-2.5 transition-colors hover:bg-accent-soft md:block"
			title={sidebarStore.isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
		>
			{#if sidebarStore.isExpanded}
				<ChevronLeft class="w-5 h-5" />
			{:else}
				<ChevronRight class="w-5 h-5" />
			{/if}
		</button>

		<button
			type="button"
			onclick={() => sidebarStore.closeMobile()}
			class="cursor-pointer rounded-control p-2.5 transition-colors hover:bg-accent-soft md:hidden"
			aria-label={m['features.app-layouts.mobile-navigation.close_menu']()}
		>
			<X class="w-5 h-5" />
		</button>
	</div>

	<Divider />

	<!-- User Card Section -->
	<div class="px-3 py-2">
		<div class="flex items-center gap-2">
			<AuthUserAvatar size={40} />
			{#if sidebarStore.showsLabels && authStore.user}
				<div class="flex-1 min-w-0" data-testid={E2E_TEST_IDS.sidebar.userEmail}>
					<p class="truncate text-sm font-medium text-ink">
						{authStore.user.name || authStore.user.email}
					</p>
					<p class="text-xs text-ink-muted">
						{authStore.user.email}
					</p>
				</div>
			{/if}
		</div>
	</div>

	<Divider />

	<SidebarLearningLanguage language={authStore.user?.selectedLearningLanguage ?? 'ENGLISH'} />

	<Divider />

	<!-- Navigation Menu Section -->
	<nav class="flex-1 overflow-hidden px-3">
		<div class="flex flex-col gap-2">
			<SidebarLink title="Home" Icon={House} href="/" />

			<SidebarLink title="Vocabulary" Icon={BookOpen} href="/words" />

			<SidebarLink title="Challenges" Icon={Gamepad2} disabled />

			<SidebarLink title="Conversations" Icon={MessageSquare} href="/conversations" />
		</div>
	</nav>

	<Divider />

	<div class="flex flex-col gap-2 px-3">
		<CaptureWordsPopover isSidebarExpanded={sidebarStore.showsLabels} />
		<ExplainPhrasePopover isSidebarExpanded={sidebarStore.showsLabels} />
	</div>

	<Divider />

	<div class="flex flex-col gap-2 px-3">
		<SidebarLink
			title="Theme"
			Icon={themeStore.isDark ? Sun : Moon}
			onclick={() => {
				themeStore.toggle();
			}}
		/>

		<!-- Settings -->
		<SidebarLink title="Settings" Icon={Settings} disabled />
	</div>

	<Divider />

	<!-- Logout Button Section -->
	<div class="px-3">
		<button
			data-testid={E2E_TEST_IDS.sidebar.logout}
			onclick={onLogoutClick}
			title="Logout"
			class={cn(
				'flex items-center py-2 rounded-control hover:bg-red-50 transition-colors w-full cursor-pointer',
				'text-danger hover:text-danger',
				sidebarStore.showsLabels ? 'gap-3 px-3 justify-start' : 'justify-center px-0'
			)}
		>
			<LogIn class="w-5 h-5 shrink-0" />
			{#if sidebarStore.showsLabels}
				<span class="text-sm font-medium" in:fade={{ delay: 150 }}>Logout</span>
			{/if}
		</button>
	</div>
</aside>
