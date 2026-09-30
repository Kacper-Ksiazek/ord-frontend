# Do not merge dev-only UI or seed panels into production paths

Temporary devtools (seed buttons, debug overlays, `*-devtools.svelte` helpers) stay out of shipped feature components. Remove them before merge, or gate behind explicit local-only tooling documented in `dev/` — never leave imports and `data-*-devtools` handlers in production `.svelte` files.

## Good

```text
// Local debugging via Storybook controls or a one-off branch — no *-devtools.svelte in the PR diff
```

## Bad

```svelte
<script lang="ts">
	import ExplainPhrasePopoverDevtools from './explain-phrase-popover-devtools.svelte';
</script>

{#if isOpen}
	<ExplainPhrasePopoverDevtools onApplySeed={…} />
{/if}
```
