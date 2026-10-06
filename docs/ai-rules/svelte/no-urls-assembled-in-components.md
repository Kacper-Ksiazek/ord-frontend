# No URLs assembled in components

A Svelte component does not build a URL from ids, names, sizes, or query pieces. That includes static asset paths, third-party CDN addresses, and API endpoints. The feature owns a function that takes those arguments and returns the string. The component calls that function.

API calls go through `http*` functions (`api-design/http-endpoint-functions.md`), not a path assembled next to markup.

## Good

```ts
// conversations/shared/utils/conversation-avatar-path.ts
export function conversationAvatarPath(id: string, size: '512x512' | '48x48'): string {
	return `/src/lib/assets/images/conversation/avatars/${id}/${size}.jpg`;
}

// language-flag-url.ts
export function languageFlagUrl(code: string): string {
	return `https://flagcdn.com/w160/${code}.png`;
}
```

```svelte
<img src={conversationAvatarPath(id, size)} alt="" />
<RemoteImage src={languageFlagUrl(flagCode)} alt="" />
```

## Bad

```ts
for (const candidate of [id, fallbackId]) {
	const path = `/src/lib/assets/images/conversation/avatars/${candidate}/${size}.jpg`;
}
```

```svelte
<RemoteImage src={`https://flagcdn.com/w160/${flagCode}.png`} alt="" />
```

```ts
await fetch(`/api/v1/home?language=${language}`);
```
