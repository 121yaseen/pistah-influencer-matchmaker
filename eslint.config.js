import reactNative from '@react-native/eslint-config';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactNativePlugin from 'eslint-plugin-react-native';
import eslintComments from 'eslint-plugin-eslint-comments';
import reactHooks from 'eslint-plugin-react-hooks';
import jest from 'eslint-plugin-jest';

export default [
  {
    ignores: ['node_modules/*', 'dist/*', 'build/*'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      react: react,
      'react-native': reactNativePlugin,
      'eslint-comments': eslintComments,
      'react-hooks': reactHooks,
      jest: jest,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactNative.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-native/no-inline-styles': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/valid-expect': 'error',
    },
  },
];
