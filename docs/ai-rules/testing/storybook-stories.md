# Storybook stories: colocated Svelte CSF, typed args, tested in CI

Stories are colocated `<component-name>.stories.svelte` files written in `@storybook/addon-svelte-csf`
v5 (no legacy template): a `<script module>` calling `defineMeta`, then `<Story>` blocks. Every story
also runs as a Vitest browser test (render smoke + axe a11y) in light **and** dark
(`bun run test:storybook`, CI job `storybook`), so a story is a test you can look at.

## When a story is required

- **Shared components in `$lib/components/`** — yes, when the component is added or its API changes.
- **Foundations** (tokens, typography, radius, elevation) — colocated in `src/lib/styles/`.
- **Feature components** — only when they have three or more visual states or need feature context
  to render (e.g. conversation messages). Never for screens, pages, or one-off layout pieces (see
  `general/proportionality-for-small-team.md`).

## Sidebar taxonomy (explicit `title`)

| Prefix                      | For                                                                    |
| --------------------------- | ---------------------------------------------------------------------- |
| `Foundations/<Topic>`       | Colors, Typography, Shape & Elevation                                  |
| `Components/<Group>/<Name>` | `$lib/components` — Buttons, Forms, Navigation, Feedback, Data Display |
| `Patterns/<Pattern>`        | Compositions from `design/patterns/` (states, toasts, page layout)     |
| `Features/<Feature>/<Name>` | Feature components that meet the bar above                             |

## Story shape

- `defineMeta` sets `component`, `tags: ['autodocs']`, and real `args` / `argTypes` — no `as any`.
- One **Playground** story driven by args (controls), plus a **Variants** / **States** story for the
  matrix. Interactive components add a `play` function for their key interaction.
- Theme, locale and the tooltip provider come from the global toolbar decorator in `.storybook/`.
  Do not render `ThemeSwitcher` / `LanguagePicker` inside stories, and do not add `$lib` decorators.
- Position with `parameters.layout` (`'centered'` default, `'padded'`, `'fullscreen'`) — not a
  wrapper decorator.
- Storybook plumbing lives in `.storybook/`; feature fixtures and context providers for stories go
  in `<feature>/testing/storybook/`.
- A11y violations fail the test. Only known, tracked token debt may set `a11y: { test: 'todo' }`,
  with a comment naming the violation.
- Import the component through the local barrel (`./index`).

## Good

```svelte
<!-- src/lib/components/buttons/button/button.stories.svelte -->
<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';
	import { Button } from './index';

	const { Story } = defineMeta({
		title: 'Components/Buttons/Button',
		component: Button,
		tags: ['autodocs'],
		args: { type: 'FILLED', variant: 'PRIMARY', onClick: fn() },
		argTypes: {
			type: { control: 'inline-radio', options: ['FILLED', 'OUTLINED'] },
			variant: { control: 'inline-radio', options: ['PRIMARY', 'TEXT', 'DELETE'] }
		}
	});
</script>

<Story name="Playground">
	{#snippet template(args)}
		<Button {...args}>Button</Button>
	{/snippet}
</Story>
```

## Bad

```svelte
<!-- static matrix only, no component/args, custom centering decorator, `as any` cast,
     app feature components imported into a $lib decorator -->
<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Buttons/Button',
		decorators: [() => CenterComponentDecorator as any]
	});
</script>
```
