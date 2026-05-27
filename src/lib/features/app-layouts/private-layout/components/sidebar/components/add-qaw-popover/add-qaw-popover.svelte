<script lang="ts">
	import { flip, shift } from '@floating-ui/dom';
	import { Button } from '$lib/components/actions/button';
	import { Input } from '$lib/components/forms/input';
	import { cn, Popover, Toggle } from 'flowbite-svelte';
	import {
		ADD_QAW_POPOVER_MAX_COUNT,
		ADD_QAW_POPOVER_ROW_HEIGHT_PX,
		ADD_QAW_POPOVER_SCROLL_FROM_COUNT,
		addQAWPopoverStore
	} from './add-qaw-popover.store.svelte';
	import { tick } from 'svelte';
	import { ArrowLeftRight, BinaryIcon, EyeIcon, Minus, Plus } from 'lucide-svelte';
	import IconButton from '$lib/components/actions/icon-button/icon-button.svelte';
	import DropdownSelect from '$lib/components/forms/dropdown-select/dropdown-select.svelte';
	import type { DropdownSelectOption } from '$lib/components/forms/dropdown-select';
	import { WordTypeOptions } from '$lib/types/word/domain/constants';
	import { getWordTypeSwatchClasses } from '$lib/types/word';
	import { Divider } from '$lib/components/surfaces/divider';
	import { AutoHeightTextarea } from '$lib/components/forms/auto-height-textarea';

	/** Min gap between popover and viewport edges (px) — external margin, not inner padding. */
	const SIDEBAR_POPOVER_VIEWPORT_MARGIN = 120;

	const sidebarPopoverMiddlewares = [
		flip({ padding: SIDEBAR_POPOVER_VIEWPORT_MARGIN }),
		shift({ padding: SIDEBAR_POPOVER_VIEWPORT_MARGIN })
	];

	/** Match sidebar (`bg-black`, `border-gray-800`) — override Flowbite `dark:bg-gray-800` on popover. */
	const sidebarPopoverClass = cn(
		'ml-4.5 w-[866px] max-w-[920px] py-2 px-3',
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

	/** Flowbite toggle track/focus — dark tokens without scoping popover as `.dark`. */
	const sidebarToggleSpanClass = cn(
		'bg-gray-600 after:border-gray-500',
		'peer-focus:ring-primary-800'
	);

	/** Outlined footer actions on black chrome — override light-theme hovers. */
	const sidebarAddMoreButtonClass = cn(
		'border-0 pl-0 text-gray-300',
		'hover:bg-white/10 hover:text-white',
		'focus:ring-offset-black focus:ring-gray-600'
	);

	const sidebarResetButtonClass = cn(
		'border-0 text-red-400',
		'hover:bg-red-900/30 hover:text-red-300',
		'focus:ring-offset-black focus:ring-red-800'
	);

	const recordsScrollMaxHeightPx =
		(ADD_QAW_POPOVER_SCROLL_FROM_COUNT - 1) * ADD_QAW_POPOVER_ROW_HEIGHT_PX;

	let recordsScrollEl: HTMLDivElement | undefined = $state();

	const isRecordsScrollable = $derived(
		addQAWPopoverStore.values.length >= ADD_QAW_POPOVER_SCROLL_FROM_COUNT
	);

	async function handleAddMore() {
		addQAWPopoverStore.addEmptyRecord();
		await tick();
		recordsScrollEl?.scrollTo({ top: recordsScrollEl.scrollHeight, behavior: 'smooth' });
	}

	$effect(() => {
		if (addQAWPopoverStore.values.length === 0) {
			addQAWPopoverStore.addEmptyRecord();
		}
	});
</script>

{#snippet wordTypeOptionLeading(option: DropdownSelectOption)}
	<span class={getWordTypeSwatchClasses(option.value)} aria-hidden="true"></span>
{/snippet}

{#snippet addWordsLayout()}
	<h2 class=" text-white">Add QAW</h2>

	<p class="text-sm text-gray-400">
		Aliquip cillum in eu. Veniam mollit quis aliquip esse consectetur aliqua exercitation. Enim cillum
	</p>

	<div
		bind:this={recordsScrollEl}
		class={cn(
			'gap-1 mt-2 mb-1 flex flex-col min-h-0',
			isRecordsScrollable && 'overflow-y-auto overscroll-contain pr-1'
		)}
		style:max-height={isRecordsScrollable ? `${recordsScrollMaxHeightPx}px` : undefined}
	>
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
						optionLeading={wordTypeOptionLeading}
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
					<Toggle
						bind:checked={wordRecord.isDescriptionEnabled}
						class="text-gray-200"
						spanClass={sidebarToggleSpanClass}
					/>

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
			onClick={handleAddMore}
			type="OUTLINED"
			variant="TEXT"
			class={sidebarAddMoreButtonClass}
			disabled={addQAWPopoverStore.values.length >= ADD_QAW_POPOVER_MAX_COUNT}
		>
			<Plus />
			<span>Add more</span>
		</Button>

		<Button
			onClick={() => addQAWPopoverStore.reset()}
			type="OUTLINED"
			variant="DELETE"
			class={sidebarResetButtonClass}
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

<Popover
	isOpen
	triggeredBy="#dupa"
	trigger="click"
	placement="right"
	class={sidebarPopoverClass}
	middlewares={sidebarPopoverMiddlewares}
>
	{@render addWordsLayout()}
</Popover>
