<script lang="ts">
	import { AppLogo } from '$lib/components/app-logo';
	import { LanguagePicker } from '$lib/components/language-picker';
	import { ThemeSwitcher } from '$lib/components/theme-switcher';
	import AuthOnlyHeader from './components/auth-only-header.svelte';
</script>

<header class="sticky top-0 z-50 w-full">
	<div class="flex justify-between items-center px-4 py-2 gap-2 container mx-auto">
		<div class="flex items-center gap-2">
			<AppLogo size="md" />
			<span class="text-xl font-bold dark:text-white">ORD</span>
		</div>

		<div class="flex items-center gap-2">
			<AuthOnlyHeader />
			<LanguagePicker />
			<ThemeSwitcher />
		</div>
	</div>
</header>
