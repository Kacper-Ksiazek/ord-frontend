# Project Brief — ORD Frontend

## What

ORD is a language-learning web application built around AI conversations. Users talk with an
AI interlocutor (text and speech/TTS), and the app analyzes their messages for mistakes,
provides severity-graded feedback, learning tips, and conversation summaries. The app supports
configurable conversation types, tones, and topics, with multilingual UI (Polish, English,
German).

This repository is the frontend only (SvelteKit). It consumes a separate backend API whose
contract is published as the `@kacper-ksiazek/ord-api-types` package.

## Nature and users

- **Hobby / side project** — built for learning and personal use.
- **Primary user is the author himself** — no external user base, no commercial pressure.

## Intent — what an AI agent should optimize for

The project deliberately balances two priorities:

1. **Architectural quality and conventions.** The codebase follows Feature-Driven Development
   (FDD) with strict boundaries, documented conventions (the rule files in `docs/ai-rules/`),
   and has undergone multiple refactoring phases to
   keep the structure clean. Do not cut corners on structure, naming, or feature boundaries.
2. **Fast feature iteration.** It is a one-person project; avoid over-engineering,
   speculative abstractions, or process overhead that does not pay off at this scale.

Practical guidance: follow the existing conventions rigorously (they are cheap to follow and
expensive to erode), but prefer the simplest implementation that fits them. A single product
feature (`conversations`) exists today — shared code in `$lib` is treated as a design system
even when it currently has one consumer, and code is only moved into a feature when there is
hard domain coupling.

## Work tracking

Work is tracked in Jira (project `ORDUI`, site kksiazek.atlassian.net — see `docs/jira/`).
Commits reference tickets: `type(ORDUI-N): summary`. Each subtask is a separate PR.
