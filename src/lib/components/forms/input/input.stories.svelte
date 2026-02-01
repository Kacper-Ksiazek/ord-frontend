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
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Basic Input</h3>
		<Input bind:value={basicValue} placeholder="Enter text..." ariaLabel="Basic input" />
		<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
			Value: <strong>{basicValue || '(empty)'}</strong>
		</p>
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
			<div>
				<label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
				<Input
					bind:value={emailValue}
					type="email"
					placeholder="user@example.com"
					leftAdornment={Mail}
					ariaLabel="Email input"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Number</label>
				<Input
					bind:value={numberValue}
					type="number"
					placeholder="Enter number"
					ariaLabel="Number input"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Phone</label>
				<Input
					bind:value={telValue}
					type="tel"
					placeholder="+1 (555) 123-4567"
					leftAdornment={User}
					ariaLabel="Phone input"
				/>
			</div>
		</div>
	</div>
</Story>

<Story name="States">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Input States</h3>
		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Disabled</label>
				<Input
					bind:value={disabledValue}
					placeholder="Disabled input"
					disabled
					leftAdornment={User}
					ariaLabel="Disabled input"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Readonly</label>
				<Input
					bind:value={readonlyValue}
					placeholder="Readonly input"
					readonly
					leftAdornment={User}
					ariaLabel="Readonly input"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Normal</label>
				<Input
					bind:value={basicValue}
					placeholder="Normal input"
					leftAdornment={User}
					ariaLabel="Normal input"
				/>
			</div>
		</div>
	</div>
</Story>
