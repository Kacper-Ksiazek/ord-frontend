# Typed props with destructured `$props()` and `class` forwarding

Define a props interface (inline `Props` for simple components, or in `<name>.types.ts` for folder components), destructure `$props()` with defaults, and accept an optional `class?: string` prop renamed to `className`/`customClass` that is merged into the root element's classes last.

## Good

```svelte
<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let { size = 'md', class: className = '' }: Props = $props();

	const sizeClasses = { sm: 'h-6 w-auto', md: 'h-12 w-auto', lg: 'h-32 w-32' };
</script>

<Logo class={cn(sizeClasses[size], className)} />
```

## Bad

```svelte
<script lang="ts">
	// untyped props, no defaults, no class forwarding
	let props = $props();
</script>

<Logo class="h-12 w-auto" />
```
