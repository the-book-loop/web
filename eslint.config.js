import js from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import pluginVue from 'eslint-plugin-vue'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
	defineConfig([
		{
			files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
			plugins: { js },
			extends: ['js/recommended'],
		},
		{
			files: ['./app/**/**/**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
			languageOptions: { globals: globals.browser },
		},
		tseslint.configs.recommended,
		pluginVue.configs['flat/essential'],
		{
			files: ['**/*.vue'],
			languageOptions: { parserOptions: { parser: tseslint.parser } },
		},
		{
			ignores: [
				'coverage',
				'**/public',
				'**/dist',
				'pnpm-lock.yaml',
				'pnpm-workspace.yaml',
			],
		},
		{
			rules: {
				'vue/require-default-prop': 'off',
				'vue/multi-word-component-names': 'off',
			},
		},
		eslintPluginPrettierRecommended,
	]),
)
