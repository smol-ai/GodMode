module.exports = {
	extends: 'erb',
	plugins: ['@typescript-eslint'],
	rules: {
		'@typescript-eslint/no-explicit-any': 'off',
		'react/react-in-jsx-scope': 'off',
		'react-hooks/exhaustive-deps': 'warn',
		'import/prefer-default-export': 'off',
		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': 'error',
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'warn',
		'import/extensions': 'off',
		'import/no-extraneous-dependencies': 'off',
	},
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
	},
	settings: {
		'import/resolver': {
			node: {},
			webpack: {
				config: require.resolve(
					'./scripts/configs/webpack.config.eslint.ts',
				),
			},
			typescript: {},
		},
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
	},
};
