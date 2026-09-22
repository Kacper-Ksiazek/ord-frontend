# Loading, empty, and error states

## Loading — prefer skeletons

**Default for new UI:** mirror the final layout with **`Skeleton`** (`$lib/components/utils/skeleton.svelte`)
or a colocated `*-skeleton.svelte` that composes skeleton blocks (see words inbox list/detail).

- Match real geometry: row height, avatar squares, `rounded-[10px]`, `border-line` shells where the
  loaded UI uses them.
- Prefer **`bg-accent-soft`** on skeleton blocks in Quiet studio surfaces (words inbox pattern).
- Set `aria-busy="true"` on the skeleton root; `aria-hidden="true"` when the skeleton is purely
  decorative placeholder with no live content.
- For **AI-shaped placeholders**, use **`AiSkeleton`** when the loaded block is clearly AI output.

**Antipatterns for page/section loading:**

- **`Loader`** (animated bars) — legacy; do not add to new screens. Replace with skeletons when
  touching those areas.
- **`Spinner`** / spinning icons for **content areas** — avoid. Spinners do not preserve layout and
  feel disconnected from the rest of the app.
- Centered indeterminate animations on empty white space for routable pages.

**Narrow exceptions (not content loading):**

- **In-button** feedback: disable the control and keep the label; do not add a spinner inside primary
  actions unless an existing component already requires it — prefer `disabled` + unchanged text.
- **Inline media controls** (e.g. play/stop while audio buffers) may use a small icon state — that
  is control state, not page skeleton policy.

Reference implementations: `words/pages/inbox/components/*-skeleton.svelte`, create-conversation
topic picker skeleton rows, `generate-ai-interlocutor` avatar skeleton.

## Empty states

- Use copy from **Paraglide**; explain the next step (e.g. create conversation, change filters).
- Keep empty UI inside the same **card/section** as the loaded list — do not navigate away silently.

## Errors

When a query or mutation fails, show something the user can act on — not only `console.error`.

- **`StatusPanel`** for full-page or blocking query failures, with **retry** via `refetch()` when using
  TanStack Query.
- **Toasts** for action/mutation outcomes and AI in-flight feedback — see
  [`toast-notifications-and-ai-progress.md`](./toast-notifications-and-ai-progress.md).
- **i18n** for headers and fallbacks; API `error.message` only when safe to expose.
- **Forms:** inline errors next to fields; avoid raw stack traces in the UI.

## Good

```svelte
{#if query.isPending}
	<CapturedWordsListSkeleton rowCount={5} />
{:else if query.isError}
	<StatusPanel variant="error" header={m['…load_error.header']()} /* … retry … */ />
{:else if items.length === 0}
	<p class="body-small text-ink-muted">{m['…empty']()}</p>
{:else}
	<!-- list -->
{/if}
```

## Bad

```svelte
{#if query.isPending}
	<Loader wrapperClass="py-8" />
{/if}

<Button onClick={save}>
	<Spinner />
	Save
</Button>
<!-- content loading via Loader/Spinner instead of skeleton or disabled button -->
```
