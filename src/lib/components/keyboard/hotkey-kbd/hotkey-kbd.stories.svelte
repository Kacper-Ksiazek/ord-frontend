<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Components/Keyboard/HotkeyKbd',
		decorators: [() => CenterComponentDecorator as any]
	});
</script>

<script lang="ts">
	import type { RegisterableHotkey } from '@tanstack/svelte-hotkeys';
	import { HotkeyKbd } from './index';

	let log = $state<string[]>([]);

	function push(msg: string) {
		log = [...log, msg];
	}
</script>

<Story name="Default">
	<div class="flex flex-col gap-6 items-start max-w-2xl">
		<p class="text-sm text-gray-600 dark:text-gray-400">
			Each badge uses a different shortcut so they do not conflict in Storybook. Open the Actions panel
			or use the log below when a shortcut fires.
		</p>

		{#snippet demoRow(
			label: string,
			hotkey: RegisterableHotkey,
			opts?: { disabled?: boolean; onActivate?: () => void }
		)}
			<div
				class="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800"
			>
				<span class="text-sm text-gray-800 dark:text-gray-100">{label}</span>

				<HotkeyKbd {hotkey} disabled={opts?.disabled} onActivate={opts?.onActivate} />
			</div>
		{/snippet}

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-primary-600 dark:text-primary-400">
			{@render demoRow('Save', 'Mod+S', { onActivate: () => push('Mod+S') })}
			{@render demoRow('Submit', 'Mod+Enter', { onActivate: () => push('Mod+Enter') })}
			{@render demoRow('Disabled (shown, not active)', 'Mod+Shift+D', {
				disabled: true,
				onActivate: () => push('should not fire')
			})}
			{@render demoRow('Display only (no handler)', 'Mod+K')}
		</div>

		{#if log.length > 0}
			<div class="text-xs font-mono text-gray-600 dark:text-gray-400 w-full">
				<p class="font-semibold mb-1">Last activations (newest last):</p>
				<ul class="list-disc pl-4">
					{#each log as line (line)}
						<li>{line}</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</Story>
