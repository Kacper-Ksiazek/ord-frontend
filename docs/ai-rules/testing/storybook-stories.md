# Storybook stories: colocated `.stories.svelte` in CSF format

Every shared design-system component (anything under `src/lib/components/`) should have a `<name>.stories.svelte` file colocated in its folder, written in `@storybook/addon-svelte-csf` format: a `<script module>` calling `defineMeta` (with `title` grouped by category, e.g. `Buttons/Button`) and one or more `<Story name="...">` blocks. Use `CenterComponentDecorator` from `$lib/storybook/decorators/` when the component should be centered, and prefer a single showcase story rendering the variant/state matrix.

## Good

```svelte
<!-- src/lib/components/buttons/button/button.stories.svelte -->
<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Buttons/Button',
		decorators: [() => CenterComponentDecorator as any]
	});
</script>

<script lang="ts">
	import { Button } from './index';
</script>

<Story name="Default">
	<Button type="FILLED" variant="PRIMARY">Button</Button>
	<Button type="OUTLINED" variant="PRIMARY" disabled>Button</Button>
</Story>
```

## Bad

```ts
// src/stories/Button.stories.ts — CSF3 .ts file, not colocated with the component
import type { Meta, StoryObj } from '@storybook/svelte';
import Button from '../lib/components/buttons/button/button.svelte';

const meta: Meta<typeof Button> = { component: Button };
export default meta;

export const Default: StoryObj<typeof Button> = {
	args: { variant: 'PRIMARY' }
};
```
