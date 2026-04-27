<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Components/Forms/Input',
		decorators: [() => CenterComponentDecorator as any]
	});
</script>

<script lang="ts">
	import { Input } from './index';
	import { Search, User, Mail, Lock, Eye, EyeOff } from 'lucide-svelte';

	// Basic input
	let basicValue = $state('');

	// Input with left adornment
	let searchValue = $state('');
	let showPassword = $state(false);

	// Input with right adornment
	let emailValue = $state('');

	// Input with both adornments
	let passwordValue = $state('');

	// Disabled and readonly states
	let disabledValue = $state('Disabled input');
	let readonlyValue = $state('Readonly input');

	// Different input types
	let numberValue = $state('');
	let telValue = $state('');
</script>

<Story name="Default">
	<div class="w-full max-w-5xl space-y-10 text-left">
		<div>
			<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Basic input</h3>
			<Input bind:value={basicValue} placeholder="Enter text..." ariaLabel="Basic input" />
			<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
				Value: <strong>{basicValue || '(empty)'}</strong>
			</p>
		</div>

		<div>
			<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
				Outlined variants (inputs are outlined-only)
			</h3>
			<p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
				Normal and disabled cells show a document hotkey on the right (<code class="text-xs"
					>Mod+Alt+1</code
				>
				through <code class="text-xs">Mod+Alt+6</code>); readonly inputs omit hotkeys.
			</p>
			<div class="grid grid-cols-4 gap-x-4 gap-y-3 items-center text-sm">
				{#snippet colHeader(text: string)}
					<div class="font-medium text-gray-600 dark:text-gray-400">{text}</div>
				{/snippet}
				{#snippet rowLabel(text: string)}
					<div class="font-medium text-gray-700 dark:text-gray-300">{text}</div>
				{/snippet}

				<div></div>
				{@render colHeader('Normal')}
				{@render colHeader('Disabled')}
				{@render colHeader('Readonly')}

				{@render rowLabel('Primary')}
				<Input
					variant="PRIMARY"
					placeholder="Primary…"
					leftAdornment={User}
					hotkey="Mod+Alt+1"
					ariaLabel="Primary"
				/>
				<Input
					variant="PRIMARY"
					placeholder="Disabled"
					value="Cannot edit"
					disabled
					leftAdornment={User}
					hotkey="Mod+Alt+2"
					ariaLabel="Primary disabled"
				/>
				<Input
					variant="PRIMARY"
					placeholder="Readonly"
					value="Read only"
					readonly
					leftAdornment={User}
					ariaLabel="Primary readonly"
				/>

				{@render rowLabel('Text')}
				<Input
					variant="TEXT"
					placeholder="Text…"
					leftAdornment={User}
					hotkey="Mod+Alt+4"
					ariaLabel="Text"
				/>
				<Input
					variant="TEXT"
					placeholder="Disabled"
					value="Cannot edit"
					disabled
					leftAdornment={User}
					hotkey="Mod+Alt+5"
					ariaLabel="Text disabled"
				/>
				<Input
					variant="TEXT"
					placeholder="Readonly"
					value="Read only"
					readonly
					leftAdornment={User}
					ariaLabel="Text readonly"
				/>

				{@render rowLabel('Delete')}
				<Input
					variant="DELETE"
					placeholder="Delete…"
					leftAdornment={User}
					hotkey="Mod+Alt+7"
					ariaLabel="Delete"
				/>
				<Input
					variant="DELETE"
					placeholder="Disabled"
					value="Cannot edit"
					disabled
					leftAdornment={User}
					hotkey="Mod+Alt+8"
					ariaLabel="Delete disabled"
				/>
				<Input
					variant="DELETE"
					placeholder="Readonly"
					value="Read only"
					readonly
					leftAdornment={User}
					ariaLabel="Delete readonly"
				/>
			</div>
		</div>
	</div>
</Story>

<Story name="With Left Adornment">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Input with Left Icon</h3>
		<Input
			bind:value={searchValue}
			placeholder="Search..."
			leftAdornment={Search}
			ariaLabel="Search input"
		/>
		<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
			Value: <strong>{searchValue || '(empty)'}</strong>
		</p>
	</div>
</Story>

<Story name="With Right Adornment">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Input with Right Icon</h3>
		<Input
			bind:value={emailValue}
			type="email"
			placeholder="Enter email"
			rightAdornment={Mail}
			ariaLabel="Email input"
		/>
		<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
			Value: <strong>{emailValue || '(empty)'}</strong>
		</p>
	</div>
</Story>

<Story name="With Both Adornments">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Input with Both Icons</h3>
		<Input
			bind:value={passwordValue}
			type={showPassword ? 'text' : 'password'}
			placeholder="Enter password"
			leftAdornment={Lock}
			rightAdornment={showPassword ? EyeOff : Eye}
			ariaLabel="Password input"
		/>
		<button
			type="button"
			class="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
			onclick={() => (showPassword = !showPassword)}
		>
			Toggle password visibility
		</button>
		<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
			Value: <strong>{passwordValue || '(empty)'}</strong>
		</p>
	</div>
</Story>

<Story name="Input Types">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Different Input Types</h3>
		<div class="space-y-4">
			<label class="block">
				<span class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</span>
				<Input
					bind:value={emailValue}
					type="email"
					placeholder="user@example.com"
					leftAdornment={Mail}
					ariaLabel="Email input"
				/>
			</label>
			<label class="block">
				<span class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Number</span>
				<Input
					bind:value={numberValue}
					type="number"
					placeholder="Enter number"
					ariaLabel="Number input"
				/>
			</label>
			<label class="block">
				<span class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Phone</span>
				<Input
					bind:value={telValue}
					type="tel"
					placeholder="+1 (555) 123-4567"
					leftAdornment={User}
					ariaLabel="Phone input"
				/>
			</label>
		</div>
	</div>
</Story>

<Story name="States">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Input States</h3>
		<div class="space-y-4">
			<label class="block">
				<span class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Disabled</span>
				<Input
					bind:value={disabledValue}
					placeholder="Disabled input"
					disabled
					leftAdornment={User}
					ariaLabel="Disabled input"
				/>
			</label>
			<label class="block">
				<span class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Readonly</span>
				<Input
					bind:value={readonlyValue}
					placeholder="Readonly input"
					readonly
					leftAdornment={User}
					ariaLabel="Readonly input"
				/>
			</label>
			<label class="block">
				<span class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Normal</span>
				<Input
					bind:value={basicValue}
					placeholder="Normal input"
					leftAdornment={User}
					ariaLabel="Normal input"
				/>
			</label>
		</div>
	</div>
</Story>
