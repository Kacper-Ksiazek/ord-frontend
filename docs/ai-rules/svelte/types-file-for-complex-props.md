# Extract complex prop types into `<name>.types.ts`

When a folder component's props are non-trivial (multiple variants, `Snippet` props, generics, exported unions), define them in a colocated `<component-name>.types.ts` file as `<ComponentName>Props` and import the type into the component. Content passed from parents is typed as `Snippet` from `svelte` and rendered with `{@render}`.

## Good

```svelte
<!-- button.types.ts -->
import type { Snippet } from 'svelte';

export interface ButtonProps {
	type?: ButtonType;
	variant?: ButtonVariant;
	disabled?: boolean;
	class?: string;
	onClick?: (event: MouseEvent) => void;
	children: Snippet;
}

<!-- button.svelte -->
<script lang="ts">
	import type { ButtonProps } from './button.types';

	let { type = 'FILLED', disabled = false, children }: ButtonProps = $props();
</script>

<button {disabled}>{@render children()}</button>
```

## Bad

```svelte
<script lang="ts">
	// large multi-variant props interface crammed inline instead of button.types.ts,
	// and legacy slot instead of a Snippet prop
	interface ButtonProps { /* 15 fields ... */ }
	let { ...props }: ButtonProps = $props();
</script>

<button><slot /></button>
```
