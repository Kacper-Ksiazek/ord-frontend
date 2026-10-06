<script lang="ts"></script>

{#snippet sectionHeaderSkeleton(titleWidth: string, actionWidth: string)}
	<div class="flex items-center justify-between gap-3">
		<div class="flex h-6 min-w-0 items-center gap-2">
			<div class="size-6 shrink-0 animate-pulse rounded-md bg-accent-soft"></div>
			<div class="h-6 max-w-full animate-pulse rounded-md bg-accent-soft {titleWidth}"></div>
		</div>
		<div
			class="h-10 shrink-0 animate-pulse rounded-[10px] bg-accent-soft {actionWidth}"
			aria-hidden="true"
		></div>
	</div>
{/snippet}

{#snippet wordRowSkeleton()}
	<li class="list-none">
		<div
			class="flex h-20 w-full items-center gap-2 rounded-[10px] border border-line bg-surface px-3"
			aria-hidden="true"
		>
			<div class="size-9 shrink-0 animate-pulse rounded-[10px] bg-accent-soft"></div>
			<div class="flex min-w-0 flex-1 items-center gap-2">
				<div class="flex min-w-0 flex-1 flex-col gap-2.5">
					<div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
						<div class="h-5 w-28 max-w-[45%] animate-pulse rounded-md bg-accent-soft"></div>
						<div class="h-5 w-24 max-w-[35%] animate-pulse rounded-md bg-accent-soft"></div>
						<div class="h-5 w-14 shrink-0 animate-pulse rounded-md bg-accent-soft"></div>
					</div>
					<div class="h-5 w-full max-w-xl animate-pulse rounded-md bg-accent-soft"></div>
				</div>
				<div class="size-4 shrink-0 animate-pulse rounded-sm bg-accent-soft"></div>
			</div>
		</div>
	</li>
{/snippet}

{#snippet conversationRowSkeleton()}
	<li class="list-none">
		<div
			class="flex h-20 w-full items-center gap-2 rounded-[10px] border border-line bg-surface px-3"
			aria-hidden="true"
		>
			<div class="size-12 shrink-0 animate-pulse rounded-[10px] bg-accent-soft"></div>
			<div class="flex min-w-0 flex-1 items-center gap-2">
				<div class="flex min-w-0 flex-1 flex-col gap-2.5">
					<div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
						<div class="h-5 w-52 max-w-full animate-pulse rounded-md bg-accent-soft"></div>
						<div class="h-5 w-16 shrink-0 animate-pulse rounded-md bg-accent-soft"></div>
					</div>
					<div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
						<div class="h-6 w-28 animate-pulse rounded-md bg-accent-soft"></div>
						<div class="h-6 w-24 animate-pulse rounded-md bg-accent-soft"></div>
						<div class="h-5 w-20 animate-pulse rounded-md bg-accent-soft"></div>
					</div>
				</div>
				<div class="size-4 shrink-0 self-center animate-pulse rounded-sm bg-accent-soft"></div>
			</div>
		</div>
	</li>
{/snippet}

<div class="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-6" aria-hidden="true">
	<section class="flex min-w-0 flex-col gap-3">
		{@render sectionHeaderSkeleton('w-44', 'w-36')}
		<ul class="flex flex-col gap-2">
			{#each { length: 3 } as _, row (row)}
				{@render wordRowSkeleton()}
			{/each}
		</ul>
		<div class="h-5 w-36 shrink-0 animate-pulse rounded-md bg-accent-soft"></div>
	</section>

	<section class="flex min-w-0 flex-col gap-3">
		{@render sectionHeaderSkeleton('w-52', 'w-44')}
		<ul class="flex flex-col gap-2">
			{#each { length: 3 } as _, row (row)}
				{@render conversationRowSkeleton()}
			{/each}
		</ul>
		<div class="h-5 w-44 shrink-0 animate-pulse rounded-md bg-accent-soft"></div>
	</section>
</div>
