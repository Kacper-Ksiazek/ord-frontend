# Dark mode via `themeStore` and semantic tokens

Theme state lives in `$lib/stores/theme.svelte.ts` (`themeStore`), which persists to localStorage and toggles the `dark` class on `<html>`. Quiet studio colors (`canvas`, `surface`, `ink`, `ink-muted`, `ink-subtle`, `line`, `accent-soft`, `highlight`, `danger`, `on-ink`) swap under `.dark` in `src/app.css`, so `bg-canvas` / `text-ink` / `border-line` work in both themes without a `dark:` pair.

Prefer those tokens. Use `dark:` only for colors that are not tokenized (e.g. analysis greens/blues). Read `themeStore.theme` / `themeStore.isDark` only when a class cannot express the difference (e.g. picking an SVG asset) — never touch `document.documentElement.classList` in components.

## Good

```svelte
<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { type Theme, themeStore } from '$lib/stores/theme.svelte';

	const logoClasses: Record<Theme, string> = {
		light: 'text-ink',
		dark: 'text-ink'
	};
</script>

<button class="rounded-[10px] border border-line bg-surface text-ink hover:bg-accent-soft">
	Toggle
</button>

<Logo class={cn('h-12 w-auto', logoClasses[themeStore.theme])} />
```

## Bad

```svelte
<script lang="ts">
	let isDark = $state(false);
	function toggle() {
		isDark = !isDark;
		document.documentElement.classList.toggle('dark');
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	}
</script>

{#if isDark}
	<button class="bg-gray-700 text-gray-300">Toggle</button>
{:else}
	<button class="bg-white text-gray-700">Toggle</button>
{/if}

<button class="bg-white text-gray-700 hover:bg-gray-50 dark:bg-zinc-800 dark:text-zinc-200">
	Toggle
</button>
```
