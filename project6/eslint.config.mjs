import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"] },
  { files: ["**/*.{js,mjs,cjs}"], 
  languageOptions: { globals: globals.node },
  rules: {
    'semi': [ 'error', 'always' ],
    'no-var': [ 'error', ],
    'prefer-const': ['error', { 'destructuring': 'any', 'ignoreReadBeforeAssign': false }],
    'curly': ['error'],
    'eqeqeq': ['error'],
    'no-multi-spaces': ['error'],
    'no-lone-blocks': ['error'],
    'no-self-compare': ['error'],
    'no-unused-expressions': ['error'],
    'no-useless-call': ['error'],
    'no-use-before-define': ['error'],
    'camelcase': ['error', {properties: 'never'}],
    'func-call-spacing': ['error'],
    'no-lonely-if': ['error'],
    'array-bracket-spacing': ['error'],
    'no-console': ['off']
  },
},
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
]);