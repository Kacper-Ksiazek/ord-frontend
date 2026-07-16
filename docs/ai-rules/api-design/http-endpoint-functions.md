# One `http*` function per endpoint, named after the HTTP verb

Every function that calls the backend lives in its own file named `http-{method}-{action-kebab}.ts` and exports a single `http{Method}{ActionPascal}` function. It uses the shared `api` axios instance from `$lib/api-client/axios`, hits a `/api/v1/...` path, and returns `response.data` explicitly (or `Promise<void>` for empty responses). Acronyms stay uppercase in export names (`AI`, `OTP`, `Tts` is the current exception — follow the existing file).

## Good

```ts
// src/lib/features/auth/api-client/api/http-get-current-user.ts
import type { UserDTO } from '$auth/types';
import { api } from '$lib/api-client/axios';

export async function httpGetCurrentUser(): Promise<UserDTO> {
	const response = await api.get<UserDTO>('/api/v1/users/me');

	return response.data;
}
```

## Bad

```ts
// fetchUser.ts — wrong name, raw axios, no typing, multiple endpoints in one file
import axios from 'axios';

export async function fetchUser() {
	return axios.get('http://localhost:3000/api/v1/users/me');
}

export async function logout() {
	return axios.delete('http://localhost:3000/api/v1/auth/logout');
}
```
