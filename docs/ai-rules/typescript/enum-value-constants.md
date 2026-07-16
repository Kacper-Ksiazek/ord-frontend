# Enum values: const arrays typed by API union types

Do not use TypeScript `enum`. Enum-like value lists are plain `as const` arrays in `enum-values.ts`-style constant files, explicitly typed with the union type from the API contract (`Type[]`), with SCREAMING_SNAKE_CASE names. Use a typed `Set` for membership-style subsets.

## Good

```ts
// src/lib/features/conversations/shared/constants/enum-values.ts
import type { ConversationType } from '$conversations/types';

export const CONVERSATION_TYPES: ConversationType[] = [
	'SMALL_TALK',
	'SCENARIO_ROLEPLAY',
	'EXAM_PRACTICE',
	'TOPIC_EXPLORATION',
	'OXFORD_DEBATE'
] as const;

/** Conversation types that cannot be chosen in the create flow (UI-only). */
export const DISABLED_CONVERSATION_TYPES = new Set<ConversationType>([
	'SCENARIO_ROLEPLAY',
	'EXAM_PRACTICE',
	'OXFORD_DEBATE'
]);
```

## Bad

```ts
// TS enum + untyped array — values not checked against the API union
export enum ConversationType {
	SmallTalk = 'SMALL_TALK',
	ExamPractice = 'EXAM_PRACTICE'
}

export const conversationTypes = ['SMALL_TALK', 'EXAM_PRACTICE'];
```
