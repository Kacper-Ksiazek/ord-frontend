# Conversation coach surfaces (session screen)

The conversation **session** has two UX surfaces that must not duplicate the same detail at the same
level:

| Surface                          | Role                                                                                                  |
| -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Message thread** (main column) | Live per-message detail: bubbles, tutor thread, inline analysis/tips, streaming, audio tied to index. |
| **Summary panel** (side)         | Session-level coach view — not live telemetry.                                                        |

## Thread → panel

Analysis/tips affordances on a message open the panel on the matching browse tab with
`filterMessageOrder` set to the **global** message index in `messagesContext.messages`.

## Summary panel tabs

- **Werdykt:** session verdict placeholder (future AI summary), average score strip, compact trend +
  severity visuals — charts follow [`tanstack-charts.md`](./tanstack-charts.md)
  (compact height in panel, token colors).
- **Przegląd** / **Wskazówki:** cross-message browse lists with filters; optional
  `filterMessageOrder` when drilled from the thread.
- **Jump to message:** `requestScrollToMessage` / `scrollToMessageIndex` → thread scrolls via
  `data-testid`.

## State (`sidepanel-context.svelte.ts`)

- `summaryTab`: `'verdict' | 'analysis' | 'learning-tips'`
- `filterMessageOrder`: number | undefined
- `scrollToMessageIndex`: one-shot scroll target

Do not reintroduce separate single-message “details” panels; use unified tabs + filter.

## Good

```
User taps tips on message 3 → panel opens on Wskazówki, filterMessageOrder = 3.
Panel shows filtered tips across session; thread still owns live bubble content.
```

## Bad

```
Duplicate full message analysis HTML in both thread and panel at the same time.
Third “message details” drawer alongside panel and thread.
```
