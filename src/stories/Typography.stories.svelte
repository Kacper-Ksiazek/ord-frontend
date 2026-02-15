<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TypographyDecorator from '$lib/storybook/decorators/typography-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Typography',
		tags: ['autodocs'],
		decorators: [() => TypographyDecorator as any]
	});
</script>

<script lang="ts">
	// Note: app.css is already imported globally in .storybook/preview.ts
</script>

<Story name="Typography Classes">
	<div class="space-y-12">
		<!-- Headings -->
		<div>
			<h2 class="heading-3 mb-6">Headings</h2>
			<div class="space-y-4">
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.heading-1</code>
					<h1 class="heading-1">Heading 1 - Main Title</h1>
				</div>
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.heading-2</code>
					<h2 class="heading-2">Heading 2 - Section Title</h2>
				</div>
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.heading-3</code>
					<h3 class="heading-3">Heading 3 - Subsection Title</h3>
				</div>
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.heading-4</code>
					<h4 class="heading-4">Heading 4 - Card Title</h4>
				</div>
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.heading-5</code>
					<h5 class="heading-5">Heading 5 - Small Heading</h5>
				</div>
				<div class="grid grid-cols-2 gap-6 items-center">
					<code class="code text-sm">.heading-6</code>
					<h6 class="heading-6">Heading 6 - Tiny Heading</h6>
				</div>
			</div>
		</div>

		<!-- Body Text -->
		<div>
			<h2 class="heading-3 mb-6">Body Text</h2>
			<div class="space-y-4">
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.body-large</code>
					<p class="body-large">Large body text for important paragraphs</p>
				</div>
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.body</code>
					<p class="body">Regular body text for standard content</p>
				</div>
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.body-small</code>
					<p class="body-small">Small body text for secondary content</p>
				</div>
				<div class="grid grid-cols-2 gap-6 items-center">
					<code class="code text-sm">.body-xs</code>
					<span class="body-xs">Extra small text for fine print</span>
				</div>
			</div>
		</div>

		<!-- Labels -->
		<div>
			<h2 class="heading-3 mb-6">Labels</h2>
			<div class="space-y-4">
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.label</code>
					<span class="label">Form Label</span>
				</div>
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.label-small</code>
					<span class="label-small">Small Label</span>
				</div>
				<div class="grid grid-cols-2 gap-6 items-center">
					<code class="code text-sm">.label-bold</code>
					<div class="label-bold">Bold Label</div>
				</div>
			</div>
		</div>

		<!-- Captions -->
		<div>
			<h2 class="heading-3 mb-6">Captions & Helper Text</h2>
			<div class="space-y-4">
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.caption</code>
					<p class="caption">Helper text or caption</p>
				</div>
				<div class="grid grid-cols-2 gap-6 items-center">
					<code class="code text-sm">.caption-muted</code>
					<p class="caption-muted">Muted caption for less prominent text</p>
				</div>
			</div>
		</div>

		<!-- Muted Text -->
		<div>
			<h2 class="heading-3 mb-6">Muted Text</h2>
			<div class="space-y-4">
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.text-muted</code>
					<p class="text-muted">Muted text with standard size</p>
				</div>
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.text-muted-small</code>
					<p class="text-muted-small">Small muted text</p>
				</div>
				<div class="grid grid-cols-2 gap-6 items-center">
					<code class="code text-sm">.text-muted-xs</code>
					<span class="text-muted-xs">Extra small muted text</span>
				</div>
			</div>
		</div>

		<!-- Emphasis -->
		<div>
			<h2 class="heading-3 mb-6">Emphasis</h2>
			<div class="space-y-4">
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.text-emphasis</code>
					<p class="body">
						Regular text with <span class="text-emphasis">emphasized text</span> inline
					</p>
				</div>
				<div class="grid grid-cols-2 gap-6 items-center">
					<code class="code text-sm">.text-strong</code>
					<p class="body">
						Regular text with <strong class="text-strong">strong text</strong> inline
					</p>
				</div>
			</div>
		</div>

		<!-- Links -->
		<div>
			<h2 class="heading-3 mb-6">Links</h2>
			<div class="space-y-4">
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.link</code>
					<p class="body">
						This is a
						<button type="button" class="link p-0! bg-transparent! border-none! cursor-pointer">
							primary link
						</button>
						with hover effects
					</p>
				</div>
				<div class="grid grid-cols-2 gap-6 items-center">
					<code class="code text-sm">.link-muted</code>
					<p class="body">
						This is a
						<button type="button" class="link-muted p-0! bg-transparent! border-none! cursor-pointer">
							muted link
						</button>
						for secondary actions
					</p>
				</div>
			</div>
		</div>

		<!-- State Colors -->
		<div>
			<h2 class="heading-3 mb-6">State Colors</h2>
			<div class="space-y-4">
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.text-error</code>
					<p class="body text-error">Error message text</p>
				</div>
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.text-success</code>
					<p class="body text-success">Success message text</p>
				</div>
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.text-warning</code>
					<p class="body text-warning">Warning message text</p>
				</div>
				<div class="grid grid-cols-2 gap-6 items-center">
					<code class="code text-sm">.text-info</code>
					<p class="body text-info">Info message text</p>
				</div>
			</div>
		</div>

		<!-- Code & Utilities -->
		<div>
			<h2 class="heading-3 mb-6">Code & Utilities</h2>
			<div class="space-y-4">
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.code</code>
					<p class="body">
						Use the <code class="code">code</code> class for inline code snippets
					</p>
				</div>
				<div
					class="grid grid-cols-2 gap-6 items-center border-b border-gray-200 dark:border-gray-700 pb-4"
				>
					<code class="code text-sm">.text-truncate</code>
					<p class="body text-truncate" style="max-width: 200px">
						This text will be truncated if it's too long to fit in the container
					</p>
				</div>
				<div class="grid grid-cols-2 gap-6 items-center">
					<code class="code text-sm">.text-ellipsis</code>
					<p class="body text-ellipsis" style="max-width: 200px">
						This text will show ellipsis when it overflows the container width
					</p>
				</div>
			</div>
		</div>
	</div>
</Story>
