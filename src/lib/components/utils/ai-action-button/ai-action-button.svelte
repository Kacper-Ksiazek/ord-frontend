<script lang="ts">
import { Button, type ButtonProps, cn, Spinner } from 'flowbite-svelte';
import { CheckCircleSolid, CloseCircleSolid, WandMagicSparklesSolid } from 'flowbite-svelte-icons';
import * as m from '$lib/paraglide/messages.js';
import type { AiActionButtonProps } from './ai-action-button.types';
import Stage from './components/stage.svelte';

let { status = $bindable('default'), disabled = false, ...rest }: AiActionButtonProps = $props();

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
    <Button
      class={cn(
        "cursor-pointer", //
        "w-full h-full flex items-center gap-1 border-primary-600 border rounded-xl",
        !disabled && "hover:bg-primary-50! hover:text-primary-600",
        disabled &&
          "cursor-not-allowed bg-gray-200! text-gray-500! border-gray-300!"
      )}
      {...props}
    >
      <WandMagicSparklesSolid
        class={cn(
          "w-5 h-5 text-amber-400", //
          disabled && "text-gray-500"
        )}
      />
      <span>{m["components.utils.generate-with-ai.button_label"]()}</span>
    </Button>
  {/snippet}

  <!-- Keep it like this in order to reserve space for all the stages -->
  <Stage class="relative opacity-0!">
    {@render aiButton({
      "aria-hidden": true,
    })}
  </Stage>

  {#if status === "default"}
    <Stage>
      {@render aiButton({
        ...rest,
        onclick: disabled ? undefined : rest.onclick,
      })}
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
