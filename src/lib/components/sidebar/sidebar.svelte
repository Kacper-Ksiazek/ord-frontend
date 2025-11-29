<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import {
		ArrowRightToBracketOutline,
		BookmarkOutline,
		ChevronLeftOutline,
		ChevronRightOutline,
		CogOutline,
		FaceGrinSolid,
		LightbulbSolid,
		MessageDotsSolid,
		MoonSolid,
		SunSolid
	} from 'flowbite-svelte-icons';
	import gravatarUrl from 'gravatar-url';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { authStore } from '$lib/stores/auth.svelte';
	import { themeStore } from '$lib/stores/theme.svelte';
	import AppLogo from '../app-logo/app-logo.svelte';
	import Divider from '../utils/divider.svelte';
	import SidebarLearningLanguage from './components/sidebar-learning-language.svelte';
	import SidebarLink from './components/sidebar-link.svelte';
	import { sidebarStore } from './sidebar.store.svelte';
	import { createLogoutMutation } from '$lib/api-client/auth/mutations';
	import { goto } from '$app/navigation';

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
	class={cn(
		'h-screen bg-black text-white flex flex-col',
		sidebarWidth,
		transitionClass,
		'z-40 border-r border-gray-800 pb-4 overflow-hidden'
	)}
>
	<!-- Header Section with Logo -->
	<div class="flex items-center justify-between px-3 row-reverse min-h-[74px]">
		{#if sidebarStore.isExpanded}
			<div class="flex items-center justify-center h-12 shrink-0 gap-2" in:fade={{ delay: 150 }}>
				<AppLogo size="sm" class="text-white" />
				<span class="text-lg font-semibold text-white">ORD</span>
			</div>
		{/if}

		<button
			onclick={toggleSidebar}
			class="p-2.5 hover:bg-gray-900 rounded-lg transition-colors cursor-pointer"
			title={sidebarStore.isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
		>
			{#if sidebarStore.isExpanded}
				<ChevronLeftOutline class="w-5 h-5" />
			{:else}
				<ChevronRightOutline class="w-5 h-5" />
			{/if}
		</button>
	</div>

	<Divider />

	<!-- User Card Section -->
	<div class="px-3 py-2">
		<div class="flex items-center gap-2">
			{#if authStore.user}
				<img
					src={gravatarUrl(authStore.user.email, {
						size: 40,
						default: 'identicon'
					})}
					alt="User avatar"
					class="w-10 h-10 rounded-full shrink-0"
				/>
			{/if}
			{#if sidebarStore.isExpanded && authStore.user}
				<div class="flex-1 min-w-0" in:fade={{ delay: 150 }}>
					<p class="text-sm font-semibold text-white truncate">
						{authStore.user.name || authStore.user.email}
					</p>
					<p class="text-xs text-gray-400">{authStore.user.email}</p>
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
			<SidebarLink title="Words" Icon={BookmarkOutline} disabled />

			<SidebarLink title="Challenges" Icon={FaceGrinSolid} disabled />

			<SidebarLink title="Conversations" Icon={MessageDotsSolid} href="/conversations" />

			<SidebarLink title="QAW" Icon={LightbulbSolid} disabled />
		</div>
	</nav>

	<Divider />

	<div class="flex flex-col gap-2 px-3">
		<SidebarLink
			title="Theme"
			Icon={themeStore.isDark ? SunSolid : MoonSolid}
			onclick={() => {
				themeStore.toggle();
			}}
		/>

		<!-- Settings -->
		<SidebarLink title="Settings" Icon={CogOutline} href="/settings" />
	</div>

	<Divider />

	<!-- Logout Button Section -->
	<div class="px-3">
		<button
			onclick={onLogoutClick}
			title="Logout"
			class={cn(
				'flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-900 transition-colors w-full cursor-pointer',
				'text-red-400 hover:text-red-300',
				sidebarStore.isExpanded && 'justify-start'
			)}
		>
			<ArrowRightToBracketOutline class="w-5 h-5 shrink-0" />
			{#if sidebarStore.isExpanded}
				<span class="text-sm font-medium" in:fade={{ delay: 150 }}>Logout</span>
			{/if}
		</button>
	</div>
</aside>
