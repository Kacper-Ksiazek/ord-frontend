<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Foundations/Colors',
		tags: ['autodocs'],
		parameters: { layout: 'padded' }
	});

	interface ColorToken {
		/** Tailwind color name, e.g. `canvas` → `bg-canvas`, `text-canvas`. */
		name: string;
		usage: string;
	}

	interface ColorGroup {
		name: string;
		tokens: ColorToken[];
	}

	// Semantic tokens from `src/app.css`; they swap under `.dark` (use the Theme toolbar).
	// Swatches read `--studio-*` because `@theme inline` does not emit the `--color-*` variables.
	const groups: ColorGroup[] = [
		{
			name: 'Surfaces',
			tokens: [
				{ name: 'canvas', usage: 'Page background' },
				{ name: 'surface', usage: 'Cards, panels, inputs' },
				{ name: 'message-ai', usage: 'AI message bubble' },
				{ name: 'accent-soft', usage: 'Hover and subtle fills' },
				{ name: 'highlight', usage: 'Text highlight' },
				{ name: 'scrim', usage: 'Overlay behind dialogs' }
			]
		},
		{
			name: 'Ink',
			tokens: [
				{ name: 'ink', usage: 'Headings, primary text' },
				{ name: 'ink-body', usage: 'Body copy' },
				{ name: 'ink-muted', usage: 'Secondary text' },
				{ name: 'ink-subtle', usage: 'Placeholders, quiet hints' },
				{ name: 'on-ink', usage: 'Text on ink fills' }
			]
		},
		{
			name: 'Lines',
			tokens: [
				{ name: 'line', usage: 'Borders, dividers' },
				{ name: 'line-subtle', usage: 'Quiet separators' }
			]
		},
		{
			name: 'Accent & status',
			tokens: [
				{ name: 'accent', usage: 'The single rose accent' },
				{ name: 'accent-ink', usage: 'Text on accent' },
				{ name: 'danger', usage: 'Destructive actions, errors' },
				{ name: 'info', usage: 'Informational states' },
				{ name: 'chart-series', usage: 'Default chart line' }
			]
		},
		{
			name: 'Scores',
			tokens: [
				{ name: 'score-low', usage: 'Score 0–20' },
				{ name: 'score-low-medium', usage: 'Score 20–40' },
				{ name: 'score-medium', usage: 'Score 40–60' },
				{ name: 'score-high', usage: 'Score 60–80' },
				{ name: 'score-perfect', usage: 'Score 80–100' },
				{ name: 'score-low-soft', usage: 'Soft fill' },
				{ name: 'score-low-medium-soft', usage: 'Soft fill' },
				{ name: 'score-medium-soft', usage: 'Soft fill' },
				{ name: 'score-high-soft', usage: 'Soft fill' },
				{ name: 'score-perfect-soft', usage: 'Soft fill' }
			]
		}
	];
</script>

<Story name="Semantic tokens">
	<div class="flex w-full max-w-5xl flex-col gap-10">
		{#each groups as group (group.name)}
			<section class="flex flex-col gap-3">
				<h2 class="table-header">{group.name}</h2>
				<div class="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-4">
					{#each group.tokens as token (token.name)}
						<div class="overflow-hidden rounded-card border border-line bg-surface">
							<div
								class="h-16 border-b border-line"
								style:background-color="var(--studio-{token.name})"
							></div>
							<div class="flex flex-col gap-1 px-3 py-2">
								<code class="label-bold">{token.name}</code>
								<span class="caption">{token.usage}</span>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/each}
	</div>
</Story>
