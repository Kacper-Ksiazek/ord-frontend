# Translation Source Files

This directory contains the source translation files that are aggregated into the main translation files used by Paraglide.

## Directory Structure

```
_source/
├── en/          # English translations
├── pl/          # Polish translations
└── de/          # German translations
```

Each language directory can contain:
- JSON files at the root level (e.g., `common.json`, `forms.json`)
- Nested subdirectories with more JSON files (e.g., `auth/login.json`, `errors/validation.json`)

## How It Works

The aggregation script (`scripts/aggregate-translations.ts`) processes all JSON files in each language directory and creates flat translation keys using dot notation.

### Example

Given this structure:
```
_source/
└── en/
    ├── common.json          # {"hello": "Hello"}
    ├── forms.json           # {"submit": "Submit"}
    └── auth/
        └── login.json       # {"title": "Sign In"}
```

The script generates:
```json
{
  "$schema": "https://inlang.com/schema/inlang-message-format",
  "common": {
    "hello": "Hello"
  },
  "forms": {
    "submit": "Submit"
  },
  "auth": {
    "login": {
      "title": "Sign In"
    }
  }
}
```

## Usage

### Manual Aggregation

Run the aggregation script manually:
```bash
npm run aggregate
```

### Automatic Aggregation

The script automatically runs before:
- `npm run dev` - Development server
- `npm run build` - Production build

## Adding New Translations

1. **Create or edit JSON files** in the appropriate language directory
2. **Use any nesting structure** you prefer for organization
3. **Run aggregation** (or start dev/build, which runs it automatically)
4. **All languages must have matching keys** - the script will error if any language is missing a translation key

### Example: Adding a new feature's translations

```bash
# Create a new directory for your feature
mkdir -p messages/_source/en/dashboard
mkdir -p messages/_source/pl/dashboard
mkdir -p messages/_source/de/dashboard

# Add translation files
echo '{"title": "Dashboard", "welcome": "Welcome back!"}' > messages/_source/en/dashboard/home.json
echo '{"title": "Pulpit", "welcome": "Witaj ponownie!"}' > messages/_source/pl/dashboard/home.json
echo '{"title": "Dashboard", "welcome": "Willkommen zurück!"}' > messages/_source/de/dashboard/home.json

# Run aggregation
npm run aggregate
```

This creates the nested structure:
```json
{
  "dashboard": {
    "home": {
      "title": "Dashboard",
      "welcome": "Welcome back!"
    }
  }
}
```

## Validation

The script validates that all languages have the same translation keys. If there's a mismatch:
- ❌ Missing keys are reported with error
- ❌ Extra keys are reported with error
- ⛔ The script exits with an error code (build will fail)

This ensures translation consistency across all languages.

## File Format

Each JSON file should contain key-value pairs where:
- **Keys** are simple strings (no nesting in individual files)
- **Values** are translation strings
- **Interpolation** is supported using `{variableName}` syntax

```json
{
  "welcome_message": "Hello, {name}!",
  "item_count": "You have {count} items"
}
```

## Best Practices

1. **Organize by feature or domain** - Group related translations together
2. **Use descriptive filenames** - The filename becomes part of the key
3. **Keep files focused** - Don't make individual files too large
4. **Match structure across languages** - Use the same directory and file structure for all languages
5. **Commit source files only** - The generated files in `messages/*.json` can be gitignored if desired

## Troubleshooting

### Error: "Translation keys are not consistent"

This means one or more languages are missing translation keys. Check the error output to see which keys are missing in which languages.

### Error: "Source directory does not exist"

Make sure the `messages/_source/{locale}` directories exist for all configured locales (en, pl, de).

### Keys not updating

Make sure you're editing files in `messages/_source/` not `messages/*.json`. The files in `messages/` are generated and will be overwritten.
