# Merge classes with `cn` from `$lib/utils/cn`

Always use `cn` imported from `$lib/utils/cn` for combining, conditioning, and merging Tailwind classes. Never use `clsx`, template-string concatenation, or manual joins. When a component accepts a `class` prop, alias it to `className` and merge it last so consumers can override defaults. Use the `!` suffix for important overrides (e.g. `bg-primary-500!`).

## Good

```svelte
<script lang="ts">
	import { cn } from '$lib/utils/cn';

	let { isSelected = false, class: className = '' }: Props = $props();
</script>

<div
	class={cn('flex items-center gap-2', 'text-ink-muted', isSelected && 'bg-accent-soft!', className)}
>
	...
</div>
```

## Bad

```svelte
<script lang="ts">
	import clsx from 'clsx';

	let { isSelected = false, class: className = '' }: Props = $props();
</script>

<!-- manual concatenation, custom class not merged last -->
<div class={`flex items-center gap-2 ${className} ${isSelected ? 'bg-primary-500' : ''}`}>...</div>
```
