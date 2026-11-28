<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Foundations/Shape & Elevation',
		tags: ['autodocs'],
		parameters: { layout: 'padded' }
	});

	// Radius and shadow scales from the `@theme` blocks in `src/app.css`.
	const radii = [
		{ className: 'rounded-chip', usage: 'Badges, chips, kbd' },
		{ className: 'rounded-control', usage: 'Buttons, inputs, menus' },
		{ className: 'rounded-card', usage: 'Cards, panels, dialogs' },
		{ className: 'rounded-full', usage: 'Pills, avatars' }
	];

	const shadows = [
		{ className: 'shadow-soft', usage: 'Resting cards' },
		{ className: 'shadow-raised', usage: 'Hover, dropdown menus' },
		{ className: 'shadow-overlay', usage: 'Dialogs, popovers' }
	];
</script>

<Story name="Radius">
	<div class="grid w-full max-w-4xl grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-6">
		{#each radii as radius (radius.className)}
			<div class="flex flex-col gap-3">
				<div class={['h-24 border border-line bg-surface', radius.className]}></div>
				<code class="label-bold">.{radius.className}</code>
				<span class="caption">{radius.usage}</span>
			</div>
		{/each}
	</div>
</Story>

<Story name="Elevation">
	<div class="grid w-full max-w-4xl grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-6">
		{#each shadows as shadow (shadow.className)}
			<div class="flex flex-col gap-3">
				<div class={['h-24 rounded-card bg-surface', shadow.className]}></div>
				<code class="label-bold">.{shadow.className}</code>
				<span class="caption">{shadow.usage}</span>
			</div>
		{/each}
	</div>
</Story>
