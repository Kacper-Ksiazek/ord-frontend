# Component Creation Guidelines

## Component Complexity Levels

### Small Components (Single File)
**Use when:** Component is simple, self-contained, < 100 lines, no sub-components.

**Structure:**
```
component-name.svelte
```

**Example:** `skeleton.svelte`, `divider.svelte`

### Medium/Complex Components (Folder Structure)
**Use when:** Component has sub-components, stores, types, or exceeds ~100 lines.

**Structure:**
```
component-name/
├── component-name.svelte      # Main component
├── component-name.store.svelte.ts  # Component-specific store (if needed)
├── component-name.types.ts    # Component-specific types (if needed)
├── index.ts                   # Barrel export
└── components/                # Sub-components (if needed)
    ├── sub-component.svelte
    └── ...
```

**Example:** `topic-picker/`, `ai-action-button/`

## Folder Structure Pattern

### Main Component File
- Named: `{component-name}.svelte`
- Contains main component logic and markup
- Imports sub-components from `./components/`

### Barrel Export (`index.ts`)
**Always include for folder-based components:**

```typescript
export { default as ComponentName } from './component-name.svelte';
```

**Usage:** Allows clean imports: `import { ComponentName } from '$lib/components/...'`

### Types File (`component-name.types.ts`)
**Include when:** Component has complex prop types or interfaces.

```typescript
export interface ComponentNameProps {
  // Props definition
}
```

### Store File (`component-name.store.svelte.ts`)
**Include when:** Component needs local reactive state shared across sub-components.

```typescript
import { SvelteMap } from 'svelte/reactivity';

export const componentState = new SvelteMap<Key, Value>([]);
```

### Sub-components Folder (`components/`)
**Include when:** Component has child components that are only used within this component.

- Place sub-components in `components/` subfolder
- Import directly: `import SubComponent from './components/sub-component.svelte'`

## Class Merging with `cn` Function

**Always use `cn` from `flowbite-svelte` for class merging:**

```typescript
import { cn } from 'flowbite-svelte';

// Basic usage
<div class={cn('base-class', customClass)}>

// Conditional classes
<div class={cn(
  'base-class',
  isActive && 'active-class',
  disabled && 'disabled-class',
  customClass
)}>

// Multiple base classes
<div class={cn(
  'flex items-center gap-2',
  'text-gray-500 dark:text-gray-200',
  isSelected && 'bg-primary-500!',
  customClass
)}>
```

**Rules:**
- Import `cn` from `flowbite-svelte` (not `clsx`)
- Always merge `customClass` prop at the end
- Use conditional classes with `&&` operator
- Use `!` suffix for important overrides: `'bg-primary-500!'`

## File Naming Conventions

- **Components:** `kebab-case.svelte` (e.g., `topic-picker.svelte`)
- **Stores:** `{component-name}.store.svelte.ts`
- **Types:** `{component-name}.types.ts`
- **Barrel:** `index.ts`
- **Sub-components:** `kebab-case.svelte` in `components/` folder

## Example: Topic Picker (Complex Component)

```
topic-picker/
├── topic-picker.svelte              # Main component
├── topic-picker.store.svelte.ts     # Shared state
├── topic-picker.types.ts            # Props/types
├── index.ts                         # Barrel export
└── components/
    ├── topic-row.svelte
    ├── generate-topics-suggestions-button.svelte
    └── custom-topic-management.svelte
```

**Main component imports:**
```svelte
<script lang="ts">
  import TopicRow from './components/topic-row.svelte';
  import { topics } from './topic-picker.store.svelte';
  import type { TopicPickerProps } from './topic-picker.types';
</script>
```

**Usage from outside:**
```svelte
<script lang="ts">
  import { TopicPicker } from '$lib/components/.../topic-picker';
</script>
```

## Best Practices

### ✅ DO
- Use folder structure for components with sub-components
- Always include `index.ts` barrel export for folder-based components
- Use `cn` from `flowbite-svelte` for all class merging
- Keep sub-components in `components/` folder
- Use descriptive, kebab-case file names
- Separate stores/types into dedicated files when complex

### ❌ DON'T
- Don't use `clsx` - always use `cn` from `flowbite-svelte`
- Don't create folders for simple single-file components
- Don't skip `index.ts` for folder-based components
- Don't mix component concerns - separate stores/types when needed
- Don't use PascalCase for file names (use kebab-case)

