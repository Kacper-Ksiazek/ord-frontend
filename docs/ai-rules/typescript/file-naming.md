# File naming: kebab-case, `.svelte.ts` for runes, colocated `.test.ts`

All files use kebab-case names. Modules that use Svelte runes (`$state`, `$derived`, `$effect`) get the `.svelte.ts` suffix. Unit tests use `.test.ts` and sit next to the file they test — never in a separate `__tests__/` or `tests/` folder.

## Good

```text
src/lib/utils/format-time.ts
src/lib/utils/format-time.test.ts                     # test colocated with source
src/lib/stores/theme.svelte.ts                        # uses runes → .svelte.ts
src/lib/api-client/api/http-post-request-tts-audio.ts
src/lib/api-client/api/http-post-request-tts-audio.test.ts
```

## Bad

```text
src/lib/utils/formatTime.ts                # camelCase filename
src/lib/utils/__tests__/format-time.spec.ts  # separate test dir + .spec suffix
src/lib/stores/theme.ts                    # runes module missing .svelte.ts suffix
```
