<script lang="ts">
	import { Button } from '$lib/components/actions/button';
	import { Input } from '$lib/components/forms/input';
	import { cn, Popover, Toggle } from 'flowbite-svelte';
	import { addQAWPopoverStore } from './add-qaw-popover.store.svelte';
	import { ArrowLeftRight, BinaryIcon, EyeIcon, Minus, Plus } from 'lucide-svelte';
	import IconButton from '$lib/components/actions/icon-button/icon-button.svelte';
	import DropdownSelect from '$lib/components/forms/dropdown-select/dropdown-select.svelte';
	import { WordTypeOptions } from '$lib/types/word/domain/constants';
	import { Divider } from '$lib/components/surfaces/divider';
	import { AutoHeightTextarea } from '$lib/components/forms/auto-height-textarea';

	/** Match sidebar (`bg-black`, `border-gray-800`) — override Flowbite `dark:bg-gray-800` on popover. */
	const sidebarPopoverClass = cn(
		'ml-4.5 max-w-[720px] py-2 px-3',
		'bg-black dark:bg-black text-white shadow-none',
		'border border-gray-800 dark:border-gray-800',
		'divide-gray-800 dark:divide-gray-800'
	);

	/** Fields on black chrome: gray-900 surface; typography/focus fixed in light theme. */
	const sidebarFieldClass = cn(
		'bg-gray-900 hover:bg-gray-900 border-gray-800',
		'text-gray-200 placeholder:text-gray-400/80',
		'focus:border-gray-400 focus:ring-gray-600 focus:ring-offset-black'
	);

	const sidebarFieldTextClass = 'text-gray-200 placeholder:text-gray-400/80';
	const sidebarAdornmentClass = 'text-gray-400';

	const sidebarDropdownMenuClass = cn(
		'bg-gray-900 border-gray-800',
		'[&_button]:text-gray-200 [&_button:hover]:bg-gray-800',
		'[&_button.font-semibold]:bg-primary-900 [&_button.font-semibold]:text-gray-100'
	);

	$effect(() => {
		if (addQAWPopoverStore.values.length === 0) {
			addQAWPopoverStore.addEmptyRecord();
		}
	});
</script>

{#snippet addWordsLayout()}
	<h2 class=" text-white">Add QAW</h2>

	<p class="text-sm text-gray-400">
		Aliquip cillum in eu. Veniam mollit quis aliquip esse consectetur aliqua exercitation. Enim cillum
	</p>

	<div class="gap-1 mt-2 mb-1 flex flex-col">
		{#each addQAWPopoverStore.values as wordRecord, index (index)}
			{#if index !== 0}
				<Divider />
			{/if}

			<div class="flex flex-col gap-1 w-full">
				<div class="flex gap-1 w-full">
					<Input
						placeholder="Word"
						class="flex-1"
						inputClass={sidebarFieldClass}
						adornmentClass={sidebarAdornmentClass}
						leftAdornment={EyeIcon}
						bind:value={wordRecord.word}
					/>

					<Input
						placeholder="Translation"
						class="flex-1"
						inputClass={sidebarFieldClass}
						adornmentClass={sidebarAdornmentClass}
						leftAdornment={ArrowLeftRight}
						bind:value={wordRecord.translation}
					/>

					<DropdownSelect
						value={wordRecord.type}
						options={WordTypeOptions}
						buttonClass={cn('w-[160px]', sidebarFieldClass)}
						dropdownClass={sidebarDropdownMenuClass}
					/>

					<IconButton
						type="OUTLINED"
						variant="DELETE"
						ariaLabel="Remove QAW record"
						onClick={() => addQAWPopoverStore.removeRecord(index)}
						icon={Minus}
					/>
				</div>

				<div class="flex gap-1">
					<Toggle bind:checked={wordRecord.isDescriptionEnabled} />

					<AutoHeightTextarea
						formField
						LINE_HEIGHT={20}
						className={cn('min-h-[40px] flex items-center', sidebarFieldClass)}
						textAreaClassName={sidebarFieldTextClass}
						placeholder="Enter description of the word"
						disabled={!wordRecord.isDescriptionEnabled}
						bind:value={wordRecord.definition}
					/>
				</div>
			</div>
		{/each}
	</div>

	<div class="flex w-full justify-between">
		<Button
			onClick={() => addQAWPopoverStore.addEmptyRecord()}
			type="OUTLINED"
			variant="TEXT"
			class="border-0 pl-0"
			disabled={addQAWPopoverStore.values.length > 10}
		>
			<Plus />
			<span>Add more</span>
		</Button>

		<Button
			onClick={() => addQAWPopoverStore.reset()}
			type="OUTLINED"
			variant="DELETE"
			class="border-0"
			disabled={addQAWPopoverStore.values.length === 1}
		>
			<BinaryIcon />
			<span>Reset</span>
		</Button>
	</div>

	<div class="flex mt-2">
		<Button class="w-[256px]">Save</Button>
	</div>
{/snippet}

<Popover isOpen triggeredBy="#dupa" trigger="click" placement="right" class={sidebarPopoverClass}>
	{@render addWordsLayout()}
</Popover>
