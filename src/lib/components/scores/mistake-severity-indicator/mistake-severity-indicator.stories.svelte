<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Scores/MistakeSeverityIndicator',
		decorators: [() => CenterComponentDecorator as any],
		tags: ['autodocs']
	});
</script>

<script lang="ts">
	import { MistakeSeverityIndicator } from './index';
	import type { ConversationMessageMistakeSeverity } from '$conversations/types';

	const severities: ConversationMessageMistakeSeverity[] = ['MINOR', 'MODERATE', 'CRITICAL'];
</script>

<Story name="Stack layout">
	<div class="p-8 bg-white dark:bg-gray-900">
		<div class="flex items-end gap-8">
			{#each severities as severity (severity)}
				<MistakeSeverityIndicator {severity} />
			{/each}
		</div>
	</div>
</Story>

<Story name="Inline layout">
	<div class="p-8 bg-white dark:bg-gray-900">
		<div class="flex flex-col gap-2">
			{#each severities as severity (severity)}
				<MistakeSeverityIndicator {severity} layout="inline" />
			{/each}
		</div>
	</div>
</Story>

<Story name="No mistakes (greyed out)">
	<div class="p-8 bg-white dark:bg-gray-900">
		<div class="flex items-end gap-8">
			{#each severities as severity (severity)}
				<MistakeSeverityIndicator {severity} hasMistakes={false} />
			{/each}
		</div>
	</div>
</Story>

<Story name="Without label">
	<div class="p-8 bg-white dark:bg-gray-900">
		<div class="flex items-end gap-8">
			{#each severities as severity (severity)}
				<MistakeSeverityIndicator {severity} showLabel={false} />
			{/each}
		</div>
	</div>
</Story>
