<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Brand/OrdLogo'
	});
</script>

<script lang="ts">
	import { OrdLogo } from './index';
</script>

<Story name="Grid">
	<div class="grid grid-cols-2 gap-8 p-8">
		<div class="flex flex-col items-center gap-3 rounded-[10px] bg-canvas p-6">
			<OrdLogo size="lg" />
			<p class="text-sm text-ink-muted">Mark / static</p>
		</div>
		<div class="flex flex-col items-center gap-3 rounded-[10px] bg-ink p-6">
			<OrdLogo size="lg" class="text-on-ink" id="story-seal" />
			<p class="text-sm text-on-ink/70">Pieczęć</p>
		</div>
		<div class="flex flex-col items-center gap-3 rounded-[10px] bg-canvas p-6">
			<OrdLogo size="xl" animate id="story-draw" />
			<p class="text-sm text-ink-muted">Animacja / mark</p>
		</div>
		<div class="flex flex-col items-center gap-3 rounded-[10px] bg-canvas p-6">
			<OrdLogo size="lg" mode="lockup" animate id="story-lockup" />
			<p class="text-sm text-ink-muted">Animacja / lockup</p>
		</div>
		<div class="flex items-end gap-4 rounded-[10px] bg-canvas p-6">
			<OrdLogo size="sm" />
			<OrdLogo size="md" />
			<OrdLogo size="lg" />
			<p class="text-sm text-ink-muted">sm / md / lg</p>
		</div>
		<div class="flex flex-col items-center gap-3 rounded-[10px] bg-highlight p-6">
			<OrdLogo size="lg" class="text-ink" />
			<p class="text-sm text-ink-muted">Highlight</p>
		</div>
	</div>
</Story>
