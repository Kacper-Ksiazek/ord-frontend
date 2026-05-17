# Spec: Conversation list `recencyBucket` (virtual column / computed field)

## Purpose

Support chat-app–style grouping on the conversations list (**Today**, **Yesterday**, **This week**, **This month**, **Later**) without each client re-implementing calendar logic. The value is derived from existing timestamps and should be **stable for a given request context** (see timezone).

## API

- **Endpoint:** existing list resource (e.g. `GET /api/v1/conversations/`).
- **Addition:** each item in the list includes a read-only field, e.g. `recencyBucket` (name bikesheddable: `listSection`, `activityBucket`, etc.).

### Type

String enum (exact casing as agreed with API conventions; frontend today expects these semantic labels):

| Value        | Meaning (see rules below)                                    |
| ------------ | ------------------------------------------------------------ |
| `TODAY`      | Activity falls on “today”                                    |
| `YESTERDAY`  | Activity falls on “yesterday”                                |
| `THIS_WEEK`  | Same ISO-style week as “now”, before today, not yesterday    |
| `THIS_MONTH` | Same calendar month/year as “now”, before start of that week |
| `LATER`      | Everything else                                              |

(OpenAPI: `enum` on `ConversationDTO` or a dedicated extension field.)

## Source instant

- **Primary:** `updatedAt` (last activity).
- **Fallback if null:** `createdAt` (should not happen if both are always set; define behavior explicitly).

All comparisons use this single **activity instant** per row.

## Reference “now”

- **Option A (recommended):** server evaluates buckets at query time using **UTC** dates (simple, consistent).
- **Option B:** accept optional query param `?timezone=Europe/Warsaw` (IANA) and compute **local** calendar day / week / month for that zone; default if omitted documented clearly.

**Product call:** Chat UIs usually match **user locale**. If the API is timezone-naive, document that the frontend may still regroup for display—or align with user profile timezone stored server-side.

## Rules (local calendar unless API is UTC-only)

Let `activity` = activity instant, `now` = reference instant for the request.

1. Normalize to **start-of-day** in the chosen zone for `activity` and `now`.
2. **`TODAY`:** activity’s date equals today’s date.
3. **`YESTERDAY`:** activity’s date equals calendar yesterday.
4. **`THIS_WEEK`:** week **starts Monday** 00:00 in that zone; activity’s date is in the same week as `now`, strictly before today’s start, and **not** yesterday (yesterday already covered).
5. **`THIS_MONTH`:** same calendar **year and month** as `now`, and activity’s start-of-day is **strictly before** the Monday that starts the week containing `now`.
6. **`LATER`:** all remaining cases (older months, years, etc.).

**Future / clock skew:** if `activity > now`, either cap to `TODAY` when same calendar day, or define a single rule (e.g. treat as `TODAY` if same day else `LATER`).

## Sorting

- Default list order remains **by activity descending** (`updatedAt` desc, tie-breaker e.g. `id`).
- `recencyBucket` is **not** a sort key by itself; it is a **display grouping** hint. Clients may still sort within a bucket using the same ordering as the API.

## Query / implementation notes

- **Virtual column:** SQL expression, generated column, or computed in the service layer mapping DTO → response—all acceptable if behavior matches this spec.
- **Indexing:** no index required on `recencyBucket`; index `updatedAt` (and filters) as today.
- **Caching:** value is request-time derived; no need to persist unless you introduce snapshot reporting.

## Frontend alignment

Current client logic lives in `src/lib/utils/group-by-recency-section.ts` (Monday-based week, local browser time). Backend should either **match** that definition for a given timezone policy or document differences so the UI can drop client-side grouping and trust the API field.

## Out of scope

- i18n of section **headings** (Today vs TODAY) stays UI-only; API sends stable enum tokens.
- Per-conversation detail views; this field is list-oriented.
