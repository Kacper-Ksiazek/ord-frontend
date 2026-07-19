# Use Svelte 5 runes, never legacy reactivity syntax

All components use Svelte 5 runes: `$props()` for props, `$state()` for local state, `$derived` / `$derived.by()` for computed values, and `$effect()` for side effects. Legacy `export let` and `$:` reactive statements are forbidden — no file in this repo uses them.

## Good

```svelte
<script lang="ts">
	let { disabled = false, hotkey }: ButtonProps = $props();

	let buttonEl: HTMLButtonElement | undefined = $state();

	const ariaKeyShortcuts = $derived(
		hotkey !== undefined ? normalizeRegisterableHotkey(hotkey, detectPlatform()) : undefined
	);

	const baseClasses = $derived.by(() =>
		cn('px-4 h-[40px] rounded-lg', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer')
	);

	$effect(() => {
		const valueArray = value.split('').slice(0, LENGTH);
		digits = [...valueArray, ...Array(LENGTH - valueArray.length).fill('')];
	});
</script>
```

## Bad

```svelte
<script lang="ts">
	export let disabled = false;
	export let hotkey;

	$: ariaKeyShortcuts =
		hotkey !== undefined ? normalizeRegisterableHotkey(hotkey, detectPlatform()) : undefined;
</script>
```
