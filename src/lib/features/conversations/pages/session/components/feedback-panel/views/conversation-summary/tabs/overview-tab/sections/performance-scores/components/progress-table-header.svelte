<script lang="ts">
	import { Tooltip } from 'flowbite-svelte';
	import { CircleQuestionMark } from 'lucide-svelte';
</script>

{#snippet tableHeaderWithTooltip(props: { id: string; label: string })}
	<th scope="col" id={props.id} class="text-center align-middle">
		<div class="flex items-center justify-center gap-1.5">
			<span class="leading-none">{props.label.charAt(0).toUpperCase()}</span>
			<CircleQuestionMark class="w-3 h-3 text-gray-600 dark:text-gray-400 shrink-0" />
		</div>
	</th>

	<!-- TODO: Fix the location of the tooltip -->
	<Tooltip triggeredBy={`#${props.id}`}>{props.label}</Tooltip>
{/snippet}

<thead class="table-header bg-gray-50 dark:bg-gray-700">
	<tr>
		<th scope="col">#</th>
		<th scope="col">Message</th>

		{@render tableHeaderWithTooltip({ id: 'grammar-header', label: 'Grammar' })}
		{@render tableHeaderWithTooltip({ id: 'vocabulary-header', label: 'Vocabulary' })}
		{@render tableHeaderWithTooltip({ id: 'naturalness-header', label: 'Naturalness' })}

		<th scope="col"></th>
	</tr>
</thead>
