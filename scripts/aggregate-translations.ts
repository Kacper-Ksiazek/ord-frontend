import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const LOCALES = ['en', 'pl', 'de'] as const;
const MESSAGES_DIR = './messages';
const SOURCE_DIR = '_source';
const SCHEMA_URL = 'https://inlang.com/schema/inlang-message-format';

type Locale = (typeof LOCALES)[number];
type TranslationMap = Record<string, string>;
type NestedObject = Record<string, string | NestedObject>;

interface ValidationResult {
	locale: Locale;
	keys: Set<string>;
}

/**
 * Recursively reads all JSON files from a directory and its subdirectories
 */
async function readJsonFilesRecursive(dir: string, basePath: string = ''): Promise<TranslationMap> {
	const translations: TranslationMap = {};

	try {
		const entries = await readdir(dir, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = join(dir, entry.name);

			if (entry.isDirectory()) {
				// Recursively process subdirectories
				const nestedTranslations = await readJsonFilesRecursive(
					fullPath,
					basePath ? `${basePath}.${entry.name}` : entry.name
				);
				Object.assign(translations, nestedTranslations);
			} else if (entry.isFile() && entry.name.endsWith('.json')) {
				// Read and process JSON file
				const content = await readFile(fullPath, 'utf-8');
				const json = JSON.parse(content);

				// Get filename without extension for key prefix
				const fileNameWithoutExt = entry.name.replace(/\.json$/, '');
				const keyPrefix = basePath ? `${basePath}.${fileNameWithoutExt}` : fileNameWithoutExt;

				// Flatten the JSON and add to translations with appropriate prefix
				for (const [key, value] of Object.entries(json)) {
					// Skip $schema field
					if (key === '$schema') continue;

					if (typeof value === 'string') {
						const fullKey = keyPrefix ? `${keyPrefix}.${key}` : key;
						translations[fullKey] = value;
					} else {
						console.warn(`Warning: Non-string value found in ${fullPath} for key "${key}". Skipping.`);
					}
				}
			}
		}
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			// Directory doesn't exist, return empty translations
			return translations;
		}
		throw error;
	}

	return translations;
}

/**
 * Converts flat dot-notation keys to nested object structure
 */
function convertToNestedObject(flatTranslations: TranslationMap): NestedObject {
	const nested: NestedObject = {};

	for (const [key, value] of Object.entries(flatTranslations)) {
		const parts = key.split('.');
		let current: NestedObject = nested;

		for (let i = 0; i < parts.length - 1; i++) {
			const part = parts[i];
			if (!(part in current)) {
				current[part] = {};
			}
			current = current[part] as NestedObject;
		}

		const lastPart = parts[parts.length - 1];
		current[lastPart] = value;
	}

	return nested;
}

/**
 * Validates that all locales have the same translation keys
 */
function validateTranslations(results: ValidationResult[]): void {
	if (results.length === 0) {
		throw new Error('No translations found to validate');
	}

	const baseLocale = results[0];
	const missingKeysByLocale: Record<Locale, string[]> = {} as Record<Locale, string[]>;
	const extraKeysByLocale: Record<Locale, string[]> = {} as Record<Locale, string[]>;

	for (let i = 1; i < results.length; i++) {
		const compareLocale = results[i];
		const missingKeys: string[] = [];
		const extraKeys: string[] = [];

		// Check for missing keys (keys in base but not in compare)
		for (const key of baseLocale.keys) {
			if (!compareLocale.keys.has(key)) {
				missingKeys.push(key);
			}
		}

		// Check for extra keys (keys in compare but not in base)
		for (const key of compareLocale.keys) {
			if (!baseLocale.keys.has(key)) {
				extraKeys.push(key);
			}
		}

		if (missingKeys.length > 0) {
			missingKeysByLocale[compareLocale.locale] = missingKeys;
		}

		if (extraKeys.length > 0) {
			extraKeysByLocale[compareLocale.locale] = extraKeys;
		}
	}

	// Report errors if any discrepancies found
	const hasErrors =
		Object.keys(missingKeysByLocale).length > 0 || Object.keys(extraKeysByLocale).length > 0;

	if (hasErrors) {
		console.error('\n❌ Translation validation failed!\n');

		for (const [locale, keys] of Object.entries(missingKeysByLocale)) {
			console.error(
				`Locale "${locale}" is missing ${keys.length} key(s) compared to "${baseLocale.locale}":`
			);
			for (const key of keys) {
				console.error(`  - ${key}`);
			}
			console.error('');
		}

		for (const [locale, keys] of Object.entries(extraKeysByLocale)) {
			console.error(
				`Locale "${locale}" has ${keys.length} extra key(s) not in "${baseLocale.locale}":`
			);
			for (const key of keys) {
				console.error(`  + ${key}`);
			}
			console.error('');
		}

		throw new Error(
			'Translation keys are not consistent across all locales. Please fix the mismatches above.'
		);
	}
}

/**
 * Aggregates translations for a single locale
 */
async function aggregateLocale(locale: Locale): Promise<ValidationResult> {
	const sourceDir = join(MESSAGES_DIR, SOURCE_DIR, locale);
	const outputPath = join(MESSAGES_DIR, `${locale}.json`);

	console.log(`Processing ${locale}...`);

	// Read all translations for this locale (flat keys)
	const flatTranslations = await readJsonFilesRecursive(sourceDir);

	// Convert to nested object structure
	const nestedTranslations = convertToNestedObject(flatTranslations);

	// Create output object with schema
	const output = {
		$schema: SCHEMA_URL,
		...nestedTranslations
	};

	// Ensure messages directory exists
	await mkdir(MESSAGES_DIR, { recursive: true });

	// Write aggregated translations
	await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf-8');

	const keyCount = Object.keys(flatTranslations).length;
	console.log(`  ✓ Aggregated ${keyCount} key(s) into ${relative(process.cwd(), outputPath)}`);

	return {
		locale,
		keys: new Set(Object.keys(flatTranslations))
	};
}

/**
 * Main aggregation function
 */
async function aggregateTranslations(): Promise<void> {
	console.log('🔄 Aggregating translations...\n');

	const startTime = Date.now();
	const results: ValidationResult[] = [];

	// Check if source directory exists
	const sourceBaseDir = join(MESSAGES_DIR, SOURCE_DIR);
	if (!existsSync(sourceBaseDir)) {
		throw new Error(
			`Source directory "${sourceBaseDir}" does not exist. Please create it and add your translation files.`
		);
	}

	// Process each locale
	for (const locale of LOCALES) {
		const result = await aggregateLocale(locale);
		results.push(result);
	}

	// Validate all locales have the same keys
	console.log('\n🔍 Validating translations...');
	validateTranslations(results);

	const duration = Date.now() - startTime;
	console.log(`\n✅ Translation aggregation completed successfully in ${duration}ms`);
}

// Run the aggregation
aggregateTranslations().catch((error) => {
	console.error('\n❌ Error:', error.message);
	process.exit(1);
});
