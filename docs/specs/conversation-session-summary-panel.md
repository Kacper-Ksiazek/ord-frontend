# Conversation session: summary panel vs message thread

Product spec for the conversation **session** screen (`conversations` feature). Update this
document when the side panel or thread UX changes — it is not a general Svelte convention.

The session has two surfaces: the **message thread** (left) and the **summary panel** (right).
They should not duplicate the same content at the same level of detail.

## Message thread

- Per-message detail: bubble text, tutor comment thread, inline analysis/tips badges, highlights.
- Live state: streaming, retries, audio playback tied to a message index.
- Entry to summary: analysis/tips icons open the panel on the matching browse tab with
  `filterMessageOrder` set to the global message index.

## Summary panel (`ConversationSummaryView`)

- Session-level coach view, not live telemetry.
- **Werdykt** tab: AI summary placeholder (future), averages score strip, compact trend + severity bar.
- **Przegląd** / **Wskazówki** tabs: cross-message browse lists with filters; optional
  `filterMessageOrder` from thread drill-down.
- Jump-to-message: `requestScrollToMessage` → messages panel scrolls via `data-testid`.

## State (`sidepanel-context.svelte.ts`)

- `summaryTab`: `'verdict' | 'analysis' | 'learning-tips'`
- `filterMessageOrder`: global index in `messagesContext.messages`
- `scrollToMessageIndex`: one-shot scroll target for the thread

Prefer unified tabs + filter over separate “details” panel views for a single message.
