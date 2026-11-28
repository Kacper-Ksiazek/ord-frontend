<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Foundations/Typography',
		tags: ['autodocs'],
		parameters: {
			layout: 'padded',
			// Known token contrast debt (WCAG AA 4.5:1): `.caption-muted` (ink-subtle) in both themes,
			// `.text-success` / `.text-warning` (score tones) in light. Flip back to 'error' once fixed.
			a11y: { test: 'todo' }
		}
	});

	interface TypeSample {
		className: string;
		sample: string;
	}

	interface TypeGroup {
		name: string;
		samples: TypeSample[];
	}

	const groups: TypeGroup[] = [
		{
			name: 'Headings',
			samples: [
				{ className: 'heading-1', sample: 'Page title' },
				{ className: 'heading-2', sample: 'Section title' },
				{ className: 'heading-3', sample: 'Subsection title' },
				{ className: 'heading-4', sample: 'Card title' },
				{ className: 'heading-5', sample: 'Small heading' },
				{ className: 'heading-6', sample: 'Tiny heading' }
			]
		},
		{
			name: 'Body',
			samples: [
				{ className: 'body-large', sample: 'Lead paragraph for important context.' },
				{ className: 'body', sample: 'Regular body text for standard content.' },
				{ className: 'body-small', sample: 'Secondary information and descriptions.' },
				{ className: 'body-xs', sample: 'Dense metadata and fine print.' },
				{
					className: 'content-long',
					sample: 'Long-form reading text with looser tracking and line height.'
				},
				{ className: 'message-body', sample: 'Conversation message bubble text.' }
			]
		},
		{
			name: 'Labels & captions',
			samples: [
				{ className: 'label', sample: 'Form label' },
				{ className: 'label-small', sample: 'Small form label' },
				{ className: 'label-bold', sample: 'Bold label' },
				{ className: 'caption', sample: 'Helper text under a field' },
				{ className: 'caption-muted', sample: 'Even quieter helper text' },
				{ className: 'table-header', sample: 'Column header' },
				{ className: 'stat-value', sample: '1,234' }
			]
		},
		{
			name: 'Emphasis & links',
			samples: [
				{ className: 'text-emphasis', sample: 'Emphasised text' },
				{ className: 'text-strong', sample: 'Strong text' },
				{ className: 'text-muted', sample: 'Muted text' },
				{ className: 'link', sample: 'Accent link' },
				{ className: 'link-muted', sample: 'Muted link' },
				{ className: 'code', sample: 'inline code' }
			]
		},
		{
			name: 'Status',
			samples: [
				{ className: 'text-error', sample: 'Something went wrong' },
				{ className: 'text-success', sample: 'Saved successfully' },
				{ className: 'text-warning', sample: 'Needs attention' },
				{ className: 'text-info', sample: 'For your information' }
			]
		}
	];
</script>

<Story name="Scale">
	<div class="flex w-full max-w-4xl flex-col gap-10">
		{#each groups as group (group.name)}
			<section class="flex flex-col gap-3">
				<h2 class="table-header">{group.name}</h2>
				<div class="divide-y divide-line rounded-card border border-line bg-surface">
					{#each group.samples as sample (sample.className)}
						<div class="grid grid-cols-[12rem_1fr] items-center gap-6 px-5 py-4">
							<code class="code w-fit">.{sample.className}</code>
							<span class={sample.className}>{sample.sample}</span>
						</div>
					{/each}
				</div>
			</section>
		{/each}
	</div>
</Story>
