<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		LogIn,
		Bookmark,
		ChevronLeft,
		ChevronRight,
		Settings,
		Smile,
		Lightbulb,
		MessageSquare,
		Moon,
		Sun
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
	import { goto } from '$app/navigation';
	import { E2E_TEST_IDS } from '$appLayouts/testing/test-ids';

	const { mutateAsync: handleLogout } = createLogoutMutation();

	onMount(() => {
		const stored = localStorage.getItem('sidebar-expanded');
		if (stored !== null) {
			sidebarStore.isExpanded = stored === 'true';
		}
	});

	function toggleSidebar() {
		sidebarStore.toggleExpanded();
		localStorage.setItem('sidebar-expanded', String(sidebarStore.isExpanded));
	}

	async function onLogoutClick() {
		await handleLogout();
		authStore.clearUser();
		goto('/login');
	}

	const sidebarWidth = $derived(sidebarStore.isExpanded ? 'w-60' : 'w-16');
	const transitionClass = 'transition-all duration-300';
</script>

<aside
	data-testid={E2E_TEST_IDS.sidebar.root}
	class={cn(
		'h-screen bg-canvas text-ink flex flex-col',
		sidebarWidth,
		transitionClass,
		'z-40 overflow-hidden border-r border-line pb-4'
	)}
>
	<!-- Header Section with Logo -->
	<div class="flex items-center justify-between px-3 row-reverse min-h-[74px]">
		{#if sidebarStore.isExpanded}
			<div class="flex items-center justify-center h-12 shrink-0 gap-2" in:fade={{ delay: 150 }}>
				<AppLogo size="sm" class="text-ink" />
				<span class="text-lg font-medium text-ink">ORD</span>
			</div>
		{/if}

		<button
			data-testid={E2E_TEST_IDS.sidebar.toggle}
			aria-expanded={sidebarStore.isExpanded}
			onclick={toggleSidebar}
			class="cursor-pointer rounded-[10px] p-2.5 transition-colors hover:bg-accent-soft"
			title={sidebarStore.isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
		>
			{#if sidebarStore.isExpanded}
				<ChevronLeft class="w-5 h-5" />
			{:else}
				<ChevronRight class="w-5 h-5" />
			{/if}
		</button>
	</div>

	<Divider />

	<!-- User Card Section -->
	<div class="px-3 py-2">
		<div class="flex items-center gap-2">
			<AuthUserAvatar size={40} />
			{#if sidebarStore.isExpanded && authStore.user}
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

	<SidebarLearningLanguage language={authStore.user?.selectedLearningLanguage || 'English'} />

	<Divider />

	<!-- Navigation Menu Section -->
	<nav class="flex-1 overflow-hidden px-3">
		<div class="flex flex-col gap-2">
			<SidebarLink title="Words" Icon={Bookmark} disabled />

			<SidebarLink title="Challenges" Icon={Smile} disabled />

			<SidebarLink title="Conversations" Icon={MessageSquare} href="/conversations" />

			<SidebarLink title="QAW" Icon={Lightbulb} disabled />
		</div>
	</nav>

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
		<SidebarLink title="Settings" Icon={Settings} href="/settings" />
	</div>

	<Divider />

	<!-- Logout Button Section -->
	<div class="px-3">
		<button
			data-testid={E2E_TEST_IDS.sidebar.logout}
			onclick={onLogoutClick}
			title="Logout"
			class={cn(
				'flex items-center gap-3 px-3 py-2 rounded-[10px] hover:bg-red-50 transition-colors w-full cursor-pointer',
				'text-danger hover:text-danger',
				sidebarStore.isExpanded && 'justify-start'
			)}
		>
			<LogIn class="w-5 h-5 shrink-0" />
			{#if sidebarStore.isExpanded}
				<span class="text-sm font-medium" in:fade={{ delay: 150 }}>Logout</span>
			{/if}
		</button>
	</div>
</aside>
