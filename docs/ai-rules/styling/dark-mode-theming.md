# Dark mode via `themeStore` and `dark:` variants

Theme state lives in the class-based rune store `$lib/stores/theme.svelte.ts` (`themeStore`), which persists to localStorage and toggles the `dark` class on `<html>`. Style dark mode declaratively with Tailwind `dark:` variants (enabled class-based via `@custom-variant dark` in `src/app.css`); read `themeStore.theme` / `themeStore.isDark` only when a class cannot express the difference (e.g. picking an SVG color) — never touch `document.documentElement.classList` in components.

## Good

```svelte
<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { type Theme, themeStore } from '$lib/stores/theme.svelte';

	const colorClasses: Record<Theme, string> = {
		light: 'text-gray-900',
		dark: 'text-gray-50'
	};
</script>

<!-- prefer dark: variants for regular styling -->
<button class="bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
	Toggle
</button>

<!-- theme-conditional classes only when a dark: variant is not enough -->
<Logo class={cn('h-12 w-auto', colorClasses[themeStore.theme])} />
```

## Bad

```svelte
<script lang="ts">
	// don't manage the theme manually in components
	let isDark = $state(false);
	function toggle() {
		isDark = !isDark;
		document.documentElement.classList.toggle('dark');
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	}
</script>

<!-- don't branch markup on theme when dark: variants can do the job -->
{#if isDark}
	<button class="bg-gray-700 text-gray-300">Toggle</button>
{:else}
	<button class="bg-white text-gray-700">Toggle</button>
{/if}
```
