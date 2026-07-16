# Merge classes with `cn` from flowbite-svelte

Always use `cn` imported from `flowbite-svelte` for combining, conditioning, and merging Tailwind classes. Never use `clsx` (it is no longer a dependency), template-string concatenation, or manual joins. When a component accepts a `class` prop, alias it to `className` and merge it last so consumers can override defaults. Use the `!` suffix for important overrides (e.g. `bg-primary-500!`).

## Good

```svelte
<script lang="ts">
	import { cn } from 'flowbite-svelte';

	let { isSelected = false, class: className = '' }: Props = $props();
</script>

<div
	class={cn(
		'flex items-center gap-2',
		'text-gray-500 dark:text-gray-200',
		isSelected && 'bg-primary-500!',
		className
	)}
>
	...
</div>
```

## Bad

```svelte
<script lang="ts">
	import clsx from 'clsx'; // clsx is not a dependency anymore

	let { isSelected = false, class: className = '' }: Props = $props();
</script>

<!-- manual concatenation, custom class not merged last -->
<div class={`flex items-center gap-2 ${className} ${isSelected ? 'bg-primary-500' : ''}`}>
	...
</div>
```
