<script lang="ts">
import { Button, type ButtonProps, cn, Spinner } from 'flowbite-svelte';
import { CheckCircleSolid, CloseCircleSolid, WandMagicSparklesSolid } from 'flowbite-svelte-icons';
import * as m from '$lib/paraglide/messages.js';
import Stage from './components/stage.svelte';

type Status = 'default' | 'loading' | 'success' | 'failed';

interface Props {
	status: Status;
	onclick: () => void;
}

let { status = $bindable('default'), ...rest }: Props = $props();

const buttonClasses = cn(
	'cursor-pointer', //
	'w-full h-full flex items-center gap-1 border-primary-600 border-1 rounded-xl',
	'hover:bg-primary-50! hover:text-primary-600'
);

$effect(() => {
	if (status === 'success' || status === 'failed') {
		setTimeout(() => {
			status = 'default';
		}, 2000);
	}
});
</script>

<div class="relative overflow-hidden rounded-xl">
  {#snippet aiButton(props?: ButtonProps)}
    <Button class={buttonClasses} {...props}>
      <WandMagicSparklesSolid
        class="w-5 h-5 text-amber-400"
        aria-hidden="true"
      />
      <span>{m["components.utils.generate-with-ai.button_label"]()}</span>
    </Button>
  {/snippet}

  <!-- Keep it like this in order to reserve space for all the stages -->
  <Stage class="relative opacity-0!">
    {@render aiButton()}
  </Stage>

  {#if status === "default"}
    <Stage>
      {@render aiButton({ ...rest })}
    </Stage>
    <!--  -->
  {:else if status === "loading"}
    <Stage class="bg-gray-200 text-gray-700">
      <Spinner size="4" class="fill-gray-700" />
      <span>{m["components.utils.generate-with-ai.generating"]()}</span>
    </Stage>
    <!--  -->
  {:else if status === "success"}
    <Stage class="bg-green-100">
      <CheckCircleSolid class="w-5 h-5 text-green-500" aria-hidden="true" />
      <span>{m["components.utils.generate-with-ai.success"]()}</span>
    </Stage>
    <!--  -->
  {:else if status === "failed"}
    <Stage class="bg-red-200">
      <CloseCircleSolid class="w-5 h-5 text-red-500" aria-hidden="true" />
      <span>{m["components.utils.generate-with-ai.failed"]()}</span>
    </Stage>
  {/if}
</div>
