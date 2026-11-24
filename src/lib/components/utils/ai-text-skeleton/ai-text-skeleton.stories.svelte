<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Utils/AiTextSkeleton'
	});
</script>

<script lang="ts">
	import { AiTextSkeleton, StreamingCaret } from './index';
</script>

<Story name="Default">
	<div class="max-w-xl space-y-8 p-6">
		<div>
			<p class="mb-2 text-xs text-ink-muted">md, with label</p>
			<AiTextSkeleton label="Explaining…" />
		</div>
		<div>
			<p class="mb-2 text-xs text-ink-muted">sm, two lines</p>
			<AiTextSkeleton size="sm" lines={['100%', '76%']} />
		</div>
		<div>
			<p class="mb-2 text-xs text-ink-muted">Streaming caret</p>
			<p class="message-body text-base">The word is still being written<StreamingCaret /></p>
		</div>
	</div>
</Story>
