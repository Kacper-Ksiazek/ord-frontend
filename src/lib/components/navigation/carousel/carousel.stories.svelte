<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Navigation/Carousel'
	});
</script>

<script lang="ts">
	import { Carousel } from './index';

	const sixItems = ['verbatim', 'suffocating', 'contingency', 'capricious', 'obfuscate', 'laconic'];
	const twoItems = sixItems.slice(0, 2);
</script>

{#snippet card(word: string)}
	<div class="w-full rounded-[10px] border border-line bg-surface p-4">
		<p class="text-2xl font-semibold tracking-tight text-ink">{word}</p>
		<p class="mt-2 text-sm text-ink-muted">Slide content</p>
	</div>
{/snippet}

<Story name="Default">
	<div class="max-w-5xl space-y-10 p-6">
		<Carousel
			items={sixItems}
			getKey={(item) => item}
			slide={card}
			ariaLabel="Six slides"
			previousLabel="Previous"
			nextLabel="Next"
		>
			{#snippet header()}
				<h3 class="text-base font-semibold text-ink">
					6 items: controls appear when content overflows
				</h3>
			{/snippet}
		</Carousel>

		<Carousel
			items={twoItems}
			getKey={(item) => item}
			slide={card}
			ariaLabel="Two slides"
			previousLabel="Previous"
			nextLabel="Next"
		>
			{#snippet header()}
				<h3 class="text-base font-semibold text-ink">2 items: everything fits, no controls</h3>
			{/snippet}
		</Carousel>
	</div>
</Story>
