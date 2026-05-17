module.exports = {
	useTabs: true,
	tabWidth: 1,
	semi: true,
	singleQuote: true,
	trailingComma: 'none',
	bracketSpacing: true,
	arrowParens: 'always',
	printWidth: 100,
	plugins: [require.resolve('prettier-plugin-svelte')],
	overrides: [
		{
			files: '*.svelte',
			options: {
				parser: 'svelte'
			}
		}
	]
};
