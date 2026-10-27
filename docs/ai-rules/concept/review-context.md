# Review context

idea_gate: required

Automated idea review and code review read this file first. The full rules stay in `docs/ai-rules/`. Cite a rule file when you flag a violation. Do not invent a standard that is not written here or in those rules. Do not clone other repositories.

## Product

ORD frontend is the SvelteKit app for AI language-learning conversations. It is a one-person hobby project. Follow the existing feature-first architecture, and prefer the smallest change that still fits it. See `concept/project-brief.md` and `general/proportionality-for-small-team.md`.

Product features today are conversations and words. Shared code in `$lib` is a design system even when one feature uses it.

## Stack

SvelteKit 2, Svelte 5 runes, TypeScript, Tailwind 4, TanStack Query, Paraglide, Vitest, Playwright, Storybook. API types come from the published package `@kacper-ksiazek/ord-api-types`. That package is the backend contract. Do not read the ord-api repository from a frontend review.

## Code review invariants

- Features live under `src/lib/features/<feature>/` and export through a public barrel. Shared UI lives in `src/lib/components/`. Shared code must not import a feature. Cross-feature imports go through the feature alias. See `general/fdd-feature-boundaries.md`.
- Routes stay thin wrappers over feature pages. See `general/thin-routes.md`.
- Contract types come from `@kacper-ksiazek/ord-api-types` and are re-exported through the feature `types/` barrel. Do not hand-write a DTO that duplicates the schema. See `api-design/api-types-from-generated-schema.md`.
- New enum-like lists are `as const` arrays typed by the API union, not TypeScript `enum`. See `typescript/enum-value-constants.md`.
- Svelte 5 runes. Prefer `$derived` before `$effect`. See `svelte/svelte-5-runes.md` and `svelte/derived-before-effect.md`.

## Idea review

A change should serve conversations, words, or the shared design system, at the size of a one-person project. Block a second parallel system, a speculative framework, or domain rules pushed into shared UI when a feature already owns them.

## Out of scope for code review

Whether the change should exist. That is the idea gate.
