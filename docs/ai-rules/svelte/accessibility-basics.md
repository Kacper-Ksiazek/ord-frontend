# Accessibility basics for interactive UI

Interactive controls should be usable with keyboard and assistive tech. You do not need a full
WCAG audit on every small change — apply sensible defaults, especially when wrapping **bits-ui**
primitives (they expose roles and keyboard behavior when composed correctly).

- Prefer native semantics (`button`, `label` + `for`, headings in order) before custom widgets.
- Icon-only controls: provide an accessible name (`aria-label` or visible text), often via i18n.
- Do not rely on color alone for severity or state; pair with text or icons already used in the design.
- Focus: avoid removing focus outlines without a visible replacement; modals/menus should trap or
  return focus per the primitive’s docs.

## Good

```svelte
<Button aria-label={m['features.conversation.session.close_panel']()} onClick={onClose}>
	<X class="size-4" />
</Button>
```

## Bad

```svelte
<div onclick={submit} class="cursor-pointer">Submit</div>
<!-- no role, no keyboard activation, no label -->
```
