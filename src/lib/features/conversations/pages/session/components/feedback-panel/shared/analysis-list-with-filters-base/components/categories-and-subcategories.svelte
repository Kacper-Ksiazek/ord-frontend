<script lang="ts">
	import { IconCard } from '$lib/components/cards/icon-card';
	import type { CategoryCard, FilterBase } from '../types/utility-types';

	interface Props {
		categories: CategoryCard[];
		filters: FilterBase;
	}

	let { categories, filters = $bindable() }: Props = $props();

	const activeCategory = $derived(categories.find((category) => category.id === filters.category));
</script>

<div class="flex justify-between items-center gap-2 mb-4">
	{#each categories as category (category.id)}
		{@const { title, value, variant } = category}

		<IconCard
			{title}
			{value}
			{variant}
			isActive={filters.category === category.id}
			disabled={category.value === 0}
			onclick={() => {
				filters.category = category.id;
				filters.subcategory = null;
			}}
		>
			{#snippet icon({ className })}
				<category.icon class={className} />
			{/snippet}
		</IconCard>
	{/each}
</div>

{#if activeCategory?.subcategories}
	<div class="flex justify-between items-center gap-2 mb-4">
		{#each activeCategory.subcategories as subcategory (subcategory.id)}
			{@const { title, value } = subcategory}

			<IconCard
				{title}
				{value}
				variant={activeCategory.variant}
				isActive={filters.subcategory === subcategory.id}
				disabled={value === 0}
				onclick={() => {
					filters.subcategory = subcategory.id;
				}}
			>
				{#snippet icon({ className })}
					<subcategory.icon class={className} />
				{/snippet}
			</IconCard>
		{/each}
	</div>
{/if}
