# API call and mutation naming patterns

HTTP client functions are named `http<Method><Resource>` and live in `http-<method>-<resource>.ts` files. TanStack Query mutation factories live in `use-<action>-mutation.ts` files and export a `create<Action>Mutation` function. The acronym "AI" is uppercased in identifiers (`httpPostGenerateAIInterlocutor`, `ConversationAIInterlocutorAvatarId`), even though filenames stay kebab-case (`http-post-generate-ai-interlocutor.ts`).

## Good

```ts
// src/lib/features/conversations/api-client/conversation/api/http-post-generate-ai-interlocutor.ts
export async function httpPostGenerateAIInterlocutor(
	body: GenerateAiInterlocutorRequest
): Promise<GeneratedAIInterlocutorData> {
	const response = await api.post<GeneratedAIInterlocutorData>(
		'/api/v1/conversations/suggest-ai-interlocutor',
		body
	);

	return response.data;
}

// src/lib/features/conversations/api-client/conversation/mutations/use-generate-ai-interlocutor-mutation.ts
export function createGenerateAiInterlocutorMutation() {
	return createMutation(() => ({
		mutationFn: (body: GenerateAiInterlocutorRequest) => httpPostGenerateAIInterlocutor(body)
	}));
}
```

## Bad

```ts
// wrong verb-less name, "Ai" casing, and file location
// src/lib/features/conversations/api-client/generateInterlocutor.ts
export async function generateAiInterlocutor(body: GenerateAiInterlocutorRequest) {
	return (await api.post('/api/v1/conversations/suggest-ai-interlocutor', body)).data;
}
```
