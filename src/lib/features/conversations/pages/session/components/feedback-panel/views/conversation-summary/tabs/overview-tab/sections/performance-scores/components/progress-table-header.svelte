<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import { CircleQuestionMark } from 'lucide-svelte';
</script>

{#snippet tableHeaderWithTooltip(props: { id: string; label: string })}
	<th scope="col" id={props.id} class="text-center align-middle">
		<Tooltip.Root>
			<Tooltip.Trigger class="inline-flex items-center justify-center gap-1.5 bg-transparent">
				<span class="leading-none">{props.label.charAt(0).toUpperCase()}</span>
				<CircleQuestionMark class="h-3 w-3 shrink-0 text-ink-muted" />
			</Tooltip.Trigger>
			<Tooltip.Portal>
				<Tooltip.Content class="overlay-surface z-50 px-2 py-1 text-xs" sideOffset={6}>
					{props.label}
				</Tooltip.Content>
			</Tooltip.Portal>
		</Tooltip.Root>
	</th>
{/snippet}

<thead class="table-header bg-accent-soft text-sm">
	<tr>
		<th scope="col">#</th>
		<th scope="col" class="normal-case">Message</th>

		{@render tableHeaderWithTooltip({ id: 'grammar-header', label: 'Grammar' })}
		{@render tableHeaderWithTooltip({ id: 'vocabulary-header', label: 'Vocabulary' })}
		{@render tableHeaderWithTooltip({ id: 'naturalness-header', label: 'Naturalness' })}
	</tr>
</thead>
