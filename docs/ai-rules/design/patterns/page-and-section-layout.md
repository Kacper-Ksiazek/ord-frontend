# Page and section layout

New screens should reuse the same **page shell** as existing list and form flows so spacing,
hierarchy, and dark mode stay consistent. Build on shared layout primitives in `$lib/components`;
see Storybook (`Utils/PageContentContainer`, `Utils/ContentCard`, `Navigation/Breadcrumb`).

## Page shell

- **`PageContentContainer`** — outer padding and max width for authenticated app pages.
- **`ContentCard`** — primary surface (`border-line`, `bg-surface`, rounded chrome) for the main
  block of a page.
- **`Breadcrumb`** — wayfinding when the screen sits under home → section (see conversations list).
- **Title block** — page `<h1>` with `text-2xl font-bold tracking-tight text-ink`; supporting copy
  with `text-ink-muted` / `body-small` from `src/lib/styles/typography.css`.
- **Section dividers** — `border-b border-line-subtle` between header/toolbars and body when the
  list already uses that rhythm.

Full-page failures (failed TanStack Query on first load) use **`StatusPanel`** instead of an empty
card — see [`loading-empty-error-states.md`](./states/loading-empty-error-states.md).

## Two-pane session layouts

Conversation **session** and similar “workspace” screens use a main column plus optional side panel
without nesting extra `ContentCard` shells per column unless the design already does. Coach /
summary content stays **session-level**; live per-item detail stays in the primary column — see
[`conversation-coach-surfaces.md`](../features/conversation-coach-surfaces.md).

## Good

```svelte
<PageContentContainer>
	<ContentCard data-testid={E2E_TEST_IDS.conversations.page}>
		<Breadcrumb class="mb-6" crumbs={[/* home, section */]} />
		<h1 class="text-2xl font-bold tracking-tight text-ink">{m['…page_title']()}</h1>
		<!-- filters + body -->
	</ContentCard>
</PageContentContainer>
```

## Bad

```svelte
<div class="mx-auto max-w-5xl p-4">
	<div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-700">
		<h1 class="text-xl">Conversations</h1>
	</div>
</div>
<!-- ad-hoc grays, no shared shell, English hard-coded title -->
```
