# Type Organization - Feature-Driven Development (FDD)

This directory contains all TypeScript type definitions organized following Feature-Driven Development (FDD) principles, mirroring the backend API architecture.

## Philosophy

Each feature is **self-contained** and owns its complete type definition hierarchy. Types are organized by feature first, then by category (api, domain, ui), ensuring clear boundaries and scalability.

## Directory Structure

```
src/lib/types/
├── auth/                           # Auth feature (standalone)
│   ├── api/
│   │   ├── requests.ts            # API request payloads
│   │   ├── responses.ts           # API response types
│   │   └── errors.ts              # Feature-specific errors
│   ├── domain/
│   │   └── entities.ts            # Domain entities (UserDTO)
│   ├── ui/                        # UI-specific types
│   └── index.ts                   # Feature barrel export
├── conversation/                   # Conversation feature
│   ├── api/
│   ├── domain/
│   ├── ui/
│   └── index.ts
├── language-proficiency/           # Language proficiency feature
├── word/                           # Word feature
├── quickly-added-word/             # Quickly added word feature
└── index.ts                        # Root barrel export (all features)
```

## Type Categories

### 1. `api/` - API Layer Types

Contains types directly related to HTTP communication with the backend API.

- **`requests.ts`** - Request payloads sent to the API

  ```typescript
  export type OtpRequestBody =
  	paths['/api/v1/auth/otp-request']['post']['requestBody']['content']['application/json'];
  ```

- **`responses.ts`** - Response types received from the API

  ```typescript
  export type LoginResponse =
  	paths['/api/v1/auth/login']['post']['responses']['200']['content']['application/json'];
  ```

- **`errors.ts`** - Feature-specific error types
  ```typescript
  export type BadRequestResponse = components['schemas']['BadRequestResponse'];
  ```

### 2. `domain/` - Domain Layer Types

Contains core business domain entities and DTOs from the OpenAPI specification.

- **`entities.ts`** - Domain entities (Data Transfer Objects)
  ```typescript
  export type UserDTO = components['schemas']['UserDTO'];
  export type ConversationDTO = components['schemas']['ConversationDTO'];
  ```

### 3. `ui/` - UI Layer Types

Contains types specific to the user interface and component layer.

- Component prop types
- UI state types
- Form types
- View models

## Usage

### Import from Specific Feature

```typescript
// Recommended: Import from specific feature for clarity
import type { UserDTO, OtpRequestBody } from '$lib/types/auth';
import type { ConversationDTO } from '$lib/types/conversation';
```

### Import from Root (All Features)

```typescript
// Alternative: Import from root barrel export
import type { UserDTO, ConversationDTO } from '$lib/types';
```

## Type Source

All types are re-exported from the `@kacper-ksiazek/ord-api-types` package, which is auto-generated from the backend OpenAPI specification. This ensures type safety and consistency between frontend and backend.

```typescript
import type { components, paths } from '@kacper-ksiazek/ord-api-types';
```

## Adding a New Feature

When adding a new feature, follow this structure:

1. **Create feature directory**

   ```bash
   mkdir -p src/lib/types/new-feature/{api,domain,ui}
   ```

2. **Create type files**
   - `api/requests.ts`
   - `api/responses.ts`
   - `api/errors.ts`
   - `domain/entities.ts`

3. **Create feature barrel export** (`new-feature/index.ts`)

   ```typescript
   export * from './domain/entities';
   export * from './api/requests';
   export * from './api/responses';
   export * from './api/errors';
   ```

4. **Add to root barrel export** (`types/index.ts`)
   ```typescript
   export * from './new-feature';
   ```

## Adding Types to an Existing Feature

1. **Identify the correct category** (api, domain, ui)
2. **Add type to appropriate file**
   ```typescript
   // In conversation/domain/entities.ts
   export type MessageDTO = components['schemas']['MessageDTO'];
   ```
3. **Types automatically exported** via feature barrel export

## Best Practices

### ✅ DO

- Keep all feature types within the feature directory
- Use singular form for feature names (`conversation`, not `conversations`)
- Use kebab-case for multi-word features (`language-proficiency`)
- Re-export types from `@kacper-ksiazek/ord-api-types` rather than duplicating
- Create UI types when component prop types become complex
- Document complex type relationships

### ❌ DON'T

- Don't create types outside the feature structure
- Don't duplicate types across features (import from owning feature)
- Don't mix concerns (keep API types separate from domain types)
- Don't create feature directories without all required subdirectories

## Cross-Feature Types

When a type is needed across multiple features, it belongs in the feature that **owns** that domain concept.

**Example:**

- `UserDTO` lives in `auth/` (auth owns user management)
- Other features import from `$lib/types/auth`
- This creates a clear dependency graph

## Benefits of FDD Type Organization

1. **Clear Boundaries** - Each feature owns its types completely
2. **Scalability** - Easy to add new features without affecting existing ones
3. **Team Efficiency** - Teams can work on features independently
4. **Mirrors Backend** - Frontend structure matches API's FDD architecture
5. **Easy Navigation** - Developers know exactly where to find types
6. **Prevents Duplication** - Single source of truth per feature
7. **Type Safety** - Auto-generated from OpenAPI ensures consistency

## Migration from Feature-Scoped Types

When migrating from old feature-scoped type files (e.g., `api-client/auth/types.ts`):

1. Move types to appropriate FDD location
2. Update all imports to use `$lib/types/feature-name`
3. Delete old types file
4. Update feature barrel exports

## Naming Conventions

- **Features**: singular, kebab-case (`auth`, `conversation`, `language-proficiency`)
- **Files**: lowercase, descriptive (`entities.ts`, `requests.ts`)
- **Types**: PascalCase with DTO suffix for entities (`UserDTO`, `ConversationDTO`)
- **Request Types**: Descriptive name ending in Body/Request (`OtpRequestBody`, `CreateWordRequest`)
- **Response Types**: Descriptive name ending in Response (`LoginResponse`)

## Examples

### Auth Feature

```typescript
// auth/domain/entities.ts
export type UserDTO = components['schemas']['UserDTO'];

// auth/api/requests.ts
export type OtpRequestBody =
	paths['/api/v1/auth/otp-request']['post']['requestBody']['content']['application/json'];

// auth/api/errors.ts
export type BadRequestResponse = components['schemas']['BadRequestResponse'];
export type FieldError = components['schemas']['FieldError'];
```

### Using Auth Types

```typescript
// In an API function
import { api } from '$lib/api-client/axios';
import type { UserDTO } from '$lib/types/auth';

export async function getCurrentUser(): Promise<UserDTO> {
	const response = await api.get<UserDTO>('/api/v1/users/me');
	return response.data;
}
```

## Maintenance

This type organization is maintained to match the backend API structure. When the backend API changes:

1. Update `@kacper-ksiazek/ord-api-types` package version
2. Update affected type re-exports
3. TypeScript compiler will catch any breaking changes

---

**Last Updated:** 2025-11-08
**Architecture:** Feature-Driven Development (FDD)
**Type Source:** `@kacper-ksiazek/ord-api-types` (OpenAPI Auto-Generated)
