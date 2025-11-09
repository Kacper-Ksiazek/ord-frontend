<script lang="ts">
import { LanguagePicker } from '$lib/components/language-picker';
import { ThemeSwitcher } from '$lib/components/theme-switcher';
</script>

<header class="sticky top-0 z-50 w-full">
	<div class="flex justify-end items-center px-4 py-2 gap-2">
		<LanguagePicker />
		<ThemeSwitcher />
	</div>
</header>
