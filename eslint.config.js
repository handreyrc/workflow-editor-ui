import globals from 'globals'
import pluginJs from '@eslint/js'
import eslintPluginSvelte from 'eslint-plugin-svelte'
import svelteParser from 'svelte-eslint-parser'
import importPlugin from 'eslint-plugin-import'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...eslintPluginSvelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      globals: globals.browser,
      parser: svelteParser,
      parserOptions: {
        parser: {
          ts: typescriptParser,
          typescript: typescriptParser
        }
      }
    },
  },
  {
    files: ['**/*.ts', '**/*.js'],
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      import: importPlugin,
    },
    languageOptions: {
      globals: globals.browser,
      parser: typescriptParser,
    },
  },
  {
    rules: {
      'no-unused-vars': 'off', // turn on in future and check why enums are not recognized
      'space-infix-ops': 'error',
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'comma-spacing': ['error', { before: false, after: true }],
      indent: ['error', 2, { SwitchCase: 1 }],
      semi: ['error', 'never'],
      quotes: [2, 'single', { avoidEscape: true }],
      'object-curly-spacing': ['error', 'always'],
      'space-before-blocks': ['error', 'always'],
      'arrow-parens': ['error', 'always'],
      'keyword-spacing': ['error', { before: true, after: true }],
      'max-len': ['error', { ignoreComments: true, ignoreStrings: true, ignoreRegExpLiterals: true, code: 160 }],
      'class-methods-use-this': 'off',
      'import/no-extraneous-dependencies': 'off', // temporary disabled
      'object-curly-newline': 'off',
      'import/prefer-default-export': 'off',
      'implicit-arrow-linebreak': 'off',
      'import/order': [
        1,
        {
          groups: [
            'external',
            'builtin',
            'internal',
            'sibling',
            'parent',
            'index',
          ],
          pathGroups: [
            {
              pattern: '$app/**',
              group: 'internal',
              position: 'after'
            },
            {
              pattern: '$lib/**',
              group: 'internal',
              position: 'after'
            },
            {
              pattern: '$components/**',
              group: 'internal',
              position: 'after'
            },
            {
              pattern: '$assets/**',
              group: 'internal',
              position: 'after'
            },
          ],
          warnOnUnassignedImports: true,
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
        }
      ]
    }
  }
]
