# Add new messages in `messages/source/`, then run `bun run aggregate`

Never edit the aggregated `messages/{pl,en,de}.json` files directly — they are generated. Add or change translations in the per-locale source files under `messages/source/<locale>/...`, keeping the exact same file and key in all three locales (pl/en/de). Then run `bun run aggregate` (also runs automatically via `predev`/`prebuild`), which merges the sources into the per-locale JSONs and fails if key parity between locales is broken.

Key conventions: the message key is derived from the source file path (`messages/source/en/features/conversation/create/step-1.json` → keys prefixed `features.conversation.create.step-1.`), directories/filenames are kebab-case, and leaf keys are snake_case (e.g. `default_type_star_tooltip`, `error_invalid_email`). Placeholders use `{name}` syntax.

## Good

```ts
// messages/source/en/features/conversation/create/step-1.json
{
	"header": "Select conversation type",
	"coming_soon_badge": "Coming soon"
}
// + the same keys added to messages/source/pl/... and messages/source/de/...
// then: bun run aggregate
```

## Bad

```ts
// Editing the generated aggregate directly — will be overwritten and breaks parity
// messages/en.json
{
	"features": { "conversation": { "create": { "step-1": { "header": "..." } } } }
}

// camelCase leaf key, added only to en (pl/de missing → aggregate script fails)
{
	"comingSoonBadge": "Coming soon"
}
```
