# Colocate Storybook stories as `<name>.stories.svelte`

Shared/reusable components get a colocated `<component-name>.stories.svelte` file in the same folder, using `@storybook/addon-svelte-csf` with `defineMeta` in a `<script module>` block and `<Story>` blocks. Import the component through the local barrel (`./index`).

## Good

```svelte
<!-- buttons/button/button.stories.svelte -->
<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Buttons/Button'
	});
</script>

<script lang="ts">
	import { Button } from './index';
</script>

<Story name="Default">
	<Button type="FILLED" variant="PRIMARY">Button</Button>
</Story>
```

## Bad

```svelte
<!-- story placed in a separate top-level stories/ tree, CSF3 .ts file,
     importing the .svelte file directly instead of the barrel -->
<!-- src/stories/Button.stories.ts -->
<script lang="ts">
	import Button from '$lib/components/buttons/button/button.svelte';
</script>
```
