# Biome Setup Guide

This project uses [Biome](https://biomejs.dev/) - a fast, modern toolchain for web development that combines linting and formatting in a single tool.

## What is Biome?

Biome is an all-in-one toolchain that replaces ESLint and Prettier:

- **10-100x faster** than traditional tools
- **Single tool** for both linting and formatting
- **Zero configuration** needed to start (but highly configurable)
- **Native support** for TypeScript, JavaScript, JSON
- **Built-in import sorting** and organization

## Installation Verification

Check that Biome is installed correctly:

```bash
bun run biome --version
```

You should see version `2.3.3` or higher.

## Available Commands

### Format Code

Format all files in the project:

```bash
bun run format
```

### Lint Code

Check for linting errors without fixing:

```bash
bun run lint
```

### Check Everything

Run both linting and formatting checks (won't modify files):

```bash
bun run check:biome
```

### Fix Everything

Run both linting and formatting with automatic fixes:

```bash
bun run fix
```

This is the most useful command for day-to-day development!

## Editor Setup (VS Code / Cursor)

### Install the Biome Extension

1. Open VS Code/Cursor
2. Go to Extensions (Cmd+Shift+X / Ctrl+Shift+X)
3. Search for "Biome"
4. Install the official **Biome** extension by `biomejs`

### Settings Already Configured

The project includes `.vscode/settings.json` with the following configuration:

- **Format on save** enabled
- **Biome** set as default formatter for JS/TS/JSON
- **Svelte** formatter for `.svelte` files
- **Auto-organize imports** on save
- **Quick fixes** applied automatically

Just reload your editor after installing the extension!

### Manual Editor Configuration

If you prefer different settings, you can modify `.vscode/settings.json`:

```json
{
	"editor.formatOnSave": true,
	"editor.defaultFormatter": "biomejs.biome",
	"editor.codeActionsOnSave": {
		"quickfix.biome": "explicit",
		"source.organizeImports.biome": "explicit"
	}
}
```

## Pre-commit Hooks

This project uses **Husky** and **lint-staged** to automatically format code before commits.

### How It Works

1. You stage files: `git add .`
2. You commit: `git commit -m "your message"`
3. **Automatically**: Biome formats and lints only staged files
4. If there are issues, the commit is blocked
5. Fix the issues and try again

### Skip Pre-commit Hooks (Not Recommended)

In rare cases where you need to skip the hooks:

```bash
git commit -m "your message" --no-verify
```

**Warning**: Only use this when absolutely necessary!

## Code Style Configuration

The project uses the following style:

- **Indentation**: Tabs
- **Quotes**: Single quotes (`'`)
- **Line width**: 100 characters
- **Semicolons**: Always
- **Trailing commas**: None
- **Arrow parentheses**: Always `(x) => x`

These settings are configured in `biome.json`.

## File Ignoring

Biome automatically ignores:

- `node_modules/`
- `.svelte-kit/`
- `build/`
- `storybook-static/`
- `src/lib/paraglide/**` (generated i18n files)
- Lock files and build artifacts

To add more ignored files, edit the `files.ignore` array in `biome.json`.

## Linting Rules

### Enabled Rules

- **Recommended rules**: All standard Biome recommendations
- **Unused variables/imports**: Error
- **Use const**: Error (prefer const over let)
- **Explicit any**: Warning (TypeScript)
- **Unused template literals**: Error

### Svelte-Specific Overrides

For `**/*.svelte` files, the following rules are disabled to ensure compatibility with Svelte 5:

- **`noUnusedVariables`**: Disabled (Svelte 5 uses `{@render children()}` and `$props()` which may appear unused to static analysis)
- **`noUnusedImports`**: Disabled (imports used in Svelte templates may not be detected correctly)
- **`useConst`**: Disabled (Svelte reactivity uses `let` for reactive variables)
- **`useImportType`**: Disabled (TypeScript import types can conflict with Svelte's template usage)

Additionally:
- **Accessibility warnings** for SVG elements (warning level)

These overrides follow the [official Biome documentation recommendations](https://biomejs.dev/guides/integrate-in-your-editor/#svelte) for framework integration.

### Config File Overrides

For `*.config.js/ts` files:

- `noExplicitAny` is disabled (common in configs)

Edit `biome.json` to customize rules.

## CI/CD Integration

### GitHub Actions Example

Add to `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
 lint:
  runs-on: ubuntu-latest
  steps:
   - uses: actions/checkout@v4
   - uses: oven-sh/setup-bun@v1
   - run: bun install
   - run: bun run check:biome
```

### Vercel Integration

Vercel will automatically run `bun run build`, which will fail if there are type errors. Add a build step:

```json
{
	"scripts": {
		"build": "bun run check:biome && vite build"
	}
}
```

## Troubleshooting

### Biome Not Formatting in Editor

1. Ensure the Biome extension is installed
2. Check that Biome is set as default formatter:
   - Open a JS/TS file
   - Right-click → Format Document With → Configure Default Formatter
   - Select **Biome**
3. Reload the editor window

### Pre-commit Hook Not Running

```bash
# Re-initialize husky
bun run prepare

# Ensure hook is executable
chmod +x .husky/pre-commit
```

### Formatting Conflicts with Svelte

Biome doesn't format `.svelte` files directly - use the Svelte extension for those. The config is already set up correctly in `.vscode/settings.json`.

### "Command not found: biome"

Make sure dependencies are installed:

```bash
bun install
```

Then try running via package.json scripts:

```bash
bun run fix
```

## Migration from ESLint/Prettier

If you had ESLint or Prettier before:

1. Remove old config files:

   ```bash
   rm .eslintrc* .prettierrc* .prettierignore
   ```

2. Remove old dependencies:

   ```bash
   bun remove eslint prettier
   ```

3. Update editor settings to disable old formatters (already done in `.vscode/settings.json`)

## Learn More

- [Biome Documentation](https://biomejs.dev/)
- [Biome Configuration Reference](https://biomejs.dev/reference/configuration/)
- [Biome Rules](https://biomejs.dev/linter/rules/)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)

## Quick Reference

| Task             | Command               |
| ---------------- | --------------------- |
| Format all files | `bun run format`      |
| Check for issues | `bun run check:biome` |
| Fix all issues   | `bun run fix`         |
| Lint only        | `bun run lint`        |
| Check types      | `bun run check`       |

**Pro tip**: Use `bun run fix` regularly to keep your code clean!
