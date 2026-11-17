import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import nextPlugin from '@next/eslint-plugin-next';
export default tseslint.config({ignores:['dist/**','out/**','.next/**','public/**']},js.configs.recommended,...tseslint.configs.recommended,{files:['src/**/*.{ts,tsx,mjs}'],languageOptions:{globals:{...globals.browser,...globals.es2022}},plugins:{'@next/next':nextPlugin},rules:{...nextPlugin.configs.recommended.rules,'@next/next/no-img-element':'off','@typescript-eslint/no-explicit-any':'off','@typescript-eslint/no-unused-vars':['error',{argsIgnorePattern:'^_'}],'no-empty':'off'}});
