# Extract complex conditional or repeated markup into local snippets

When a component's markup contains heavy conditional branches (`{#if}` chains) or a
non-trivial block rendered in a loop / multiple times, define that block as a local
Svelte 5 `{#snippet}` (with typed parameters when it takes arguments) and `{@render}` it.
The main markup then reads as a short, declarative outline instead of a wall of nested HTML.

## Good

```svelte
<!-- generate-ai-interlocutor.svelte — each state is a named snippet, -->
<!-- the actual markup is a 7-line state machine -->
{#snippet generated_avatar()}
	<div class="relative mx-auto flex w-full flex-col items-center gap-3">
		<!-- ... avatar, regenerate button, name ... -->
	</div>
{/snippet}

{#snippet generating_in_progress()}
	<div class="mx-auto flex w-full max-w-96 flex-col items-center gap-3">
		<Skeleton class="size-[320px] rounded-full" />
		<!-- ... -->
	</div>
{/snippet}

{#snippet generation_error_screen()}
	<!-- ... error message + retry ... -->
{/snippet}

<section class="flex w-[360px] flex-col items-center gap-4">
	{#if hasGeneratedInterlocutor}
		{@render generated_avatar()}
	{:else if isGenerating}
		{@render generating_in_progress()}
	{:else if generationFailed || !canGenerate}
		{@render generation_error_screen()}
	{/if}
</section>
```

```svelte
<!-- overview-tab.svelte — repeated block with typed params, rendered 3 times -->
{#snippet performanceScore(props: { label: string; score: number | null; averageScore: number })}
	<div class="flex flex-col items-center gap-2">
		<CircularProgressBar label={props.label} score={props.score} />
		<ScoreDiffIndicator currentScore={props.score} averageScore={props.averageScore} />
	</div>
{/snippet}

<div class="grid grid-cols-3 gap-4">
	{@render performanceScore({ label: 'Grammar', score: feedback.grammar, averageScore: averageScores.grammar })}
	{@render performanceScore({ label: 'Vocabulary', score: feedback.vocabulary, averageScore: averageScores.vocabulary })}
	{@render performanceScore({ label: 'Naturalness', score: feedback.naturalness, averageScore: averageScores.naturalness })}
</div>
```

## Bad

```svelte
<!-- Everything inlined: deep nesting, duplicated markup between branches, -->
<!-- impossible to see the state machine at a glance -->
<section class="flex w-[360px] flex-col items-center gap-4">
	{#if hasGeneratedInterlocutor}
		<div class="relative mx-auto flex w-full flex-col items-center gap-3">
			<IconButton icon={RefreshCw} ... />
			<div class={cn('avatar-regen-shell ...', isGenerating && '...')}>
				<AIInterlocutorAvatar ... />
			</div>
			<h3 class="heading-5 w-full text-center">{payload.aiInterlocutorName}</h3>
		</div>
	{:else if isGenerating}
		<div class="mx-auto flex w-full max-w-96 flex-col items-center gap-3">
			<Skeleton class="size-[320px] rounded-full" />
			<!-- 10 more lines ... -->
		</div>
	{:else if generationFailed || !canGenerate}
		<!-- 20 more lines ... -->
	{/if}
</section>
```

Notes:

- Keep snippets local to the component (defined in the same file); if a block is needed by
  other components, promote it to a sub-component in a `components/` subfolder instead.
- Type snippet parameters inline (`props: { label: string; ... }`) — snippets are
  type-checked like functions.
- This is for readability of large blocks; don't wrap trivial one-liners in snippets.
