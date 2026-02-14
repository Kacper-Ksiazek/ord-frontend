<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Components/Cards/IconCard',
		decorators: [() => CenterComponentDecorator as any]
	});
</script>

<script lang="ts">
	import { IconCard } from './index';
	import { SigmaIcon, BookOpen, MessageSquare, BookMarked, TrendingUp } from 'lucide-svelte';

	let activeCard = $state<string | null>(null);
</script>

<Story name="Default">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
			Default IconCard (Primary)
		</h3>
		<IconCard title="Total" value={42} class="min-w-[260px]">
			{#snippet icon({ className })}
				<SigmaIcon class={className} />
			{/snippet}
		</IconCard>
	</div>
</Story>

<Story name="Variants">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">All Variants</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<IconCard title="Primary" value={100} variant="primary" class="min-w-[260px]">
				{#snippet icon({ className })}
					<SigmaIcon class={className} />
				{/snippet}
			</IconCard>
			<IconCard title="Blue" value={75} variant="blue" class="min-w-[260px]">
				{#snippet icon({ className })}
					<BookOpen class={className} />
				{/snippet}
			</IconCard>
			<IconCard title="Green" value={50} variant="green" class="min-w-[260px]">
				{#snippet icon({ className })}
					<MessageSquare class={className} />
				{/snippet}
			</IconCard>
			<IconCard title="Red" value={25} variant="red" class="min-w-[260px]">
				{#snippet icon({ className })}
					<BookMarked class={className} />
				{/snippet}
			</IconCard>
			<IconCard title="Purple" value={88} variant="purple" class="min-w-[260px]">
				{#snippet icon({ className })}
					<TrendingUp class={className} />
				{/snippet}
			</IconCard>
		</div>
	</div>
</Story>

<Story name="Active/Inactive Toggle">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
			Toggle Active State (Click cards to toggle)
		</h3>
		<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
			Active card: <strong>{activeCard || 'None'}</strong>
		</p>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<IconCard
				title="Primary"
				value={100}
				variant="primary"
				isActive={activeCard === 'primary'}
				class="min-w-[400px] cursor-pointer"
				onclick={() => (activeCard = activeCard === 'primary' ? null : 'primary')}
			>
				{#snippet icon({ className })}
					<SigmaIcon class={className} />
				{/snippet}
			</IconCard>
			<IconCard
				title="Blue"
				value={75}
				variant="blue"
				isActive={activeCard === 'blue'}
				class="min-w-[400px] cursor-pointer"
				onclick={() => (activeCard = activeCard === 'blue' ? null : 'blue')}
			>
				{#snippet icon({ className })}
					<BookOpen class={className} />
				{/snippet}
			</IconCard>
			<IconCard
				title="Green"
				value={50}
				variant="green"
				isActive={activeCard === 'green'}
				class="min-w-[400px] cursor-pointer"
				onclick={() => (activeCard = activeCard === 'green' ? null : 'green')}
			>
				{#snippet icon({ className })}
					<MessageSquare class={className} />
				{/snippet}
			</IconCard>
			<IconCard
				title="Red"
				value={25}
				variant="red"
				isActive={activeCard === 'red'}
				class="min-w-[400px] cursor-pointer"
				onclick={() => (activeCard = activeCard === 'red' ? null : 'red')}
			>
				{#snippet icon({ className })}
					<BookMarked class={className} />
				{/snippet}
			</IconCard>
			<IconCard
				title="Purple"
				value={88}
				variant="purple"
				isActive={activeCard === 'purple'}
				class="min-w-[400px] cursor-pointer"
				onclick={() => (activeCard = activeCard === 'purple' ? null : 'purple')}
			>
				{#snippet icon({ className })}
					<TrendingUp class={className} />
				{/snippet}
			</IconCard>
		</div>
	</div>
</Story>

<Story name="String Values">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">String Values</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<IconCard title="Status" value="Active" variant="green" class="min-w-[260px]">
				{#snippet icon({ className })}
					<MessageSquare class={className} />
				{/snippet}
			</IconCard>
			<IconCard title="Version" value="v2.0.1" variant="blue" class="min-w-[260px]">
				{#snippet icon({ className })}
					<BookOpen class={className} />
				{/snippet}
			</IconCard>
		</div>
	</div>
</Story>

<Story name="Custom Classes">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">With Custom Classes</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<IconCard title="Wide Card" value={123} variant="purple" class="min-w-[260px] w-full max-w-md">
				{#snippet icon({ className })}
					<TrendingUp class={className} />
				{/snippet}
			</IconCard>
			<IconCard title="Custom Margin" value={456} variant="red" class="min-w-[260px] ml-8">
				{#snippet icon({ className })}
					<BookMarked class={className} />
				{/snippet}
			</IconCard>
		</div>
	</div>
</Story>

<Story name="Grid Layout">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Grid Layout Example</h3>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<IconCard title="Total Users" value={1250} variant="primary" class="min-w-[260px]">
				{#snippet icon({ className })}
					<SigmaIcon class={className} />
				{/snippet}
			</IconCard>
			<IconCard title="Active Sessions" value={342} variant="blue" class="min-w-[260px]">
				{#snippet icon({ className })}
					<MessageSquare class={className} />
				{/snippet}
			</IconCard>
			<IconCard title="Completed" value={908} variant="green" class="min-w-[260px]">
				{#snippet icon({ className })}
					<BookOpen class={className} />
				{/snippet}
			</IconCard>
		</div>
	</div>
</Story>
