<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Features/Auth/OtpInput'
	});
</script>

<script lang="ts">
	import OtpInput from './otp-input.svelte';

	let defaultValue = $state('');
	let disabledValue = $state('123456');
	let errorValue = $state('');
	let completedValue = $state('');
	let lastCompletedValue = $state('');
</script>

<Story name="Default">
	<div class="p-8 bg-white">
		<OtpInput bind:value={defaultValue} />
		<p class="mt-4 text-center text-sm text-gray-600">Value: {defaultValue}</p>
	</div>
</Story>

<Story name="With Error">
	<div class="p-8 bg-white">
		<OtpInput bind:value={errorValue} error={true} />
		<p class="mt-4 text-center text-sm text-red-600">Error state active</p>
	</div>
</Story>

<Story name="Disabled">
	<div class="p-8 bg-white">
		<OtpInput bind:value={disabledValue} disabled={true} />
		<p class="mt-4 text-center text-sm text-gray-600">Disabled with value: {disabledValue}</p>
	</div>
</Story>

<Story name="With Complete Callback">
	<div class="p-8 bg-white">
		<OtpInput
			bind:value={completedValue}
			oncomplete={(value) => {
				lastCompletedValue = value;
				alert(`OTP Complete: ${value}`);
			}}
		/>
		<p class="mt-4 text-center text-sm text-gray-600">
			Current value: {completedValue}
		</p>
		{#if lastCompletedValue}
			<p class="mt-2 text-center text-sm text-green-600">
				Last completed: {lastCompletedValue}
			</p>
		{/if}
		<p class="mt-2 text-center text-xs text-gray-500">Press Enter when all 6 digits are filled</p>
	</div>
</Story>
