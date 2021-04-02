module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    'no-null',
  ],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended', // Uses typescript-specific linting rules
    'prettier/@typescript-eslint',  // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier
  ],
  parserOptions: {
    ecmaVersion: 2018,  // Allows for the parsing of modern ECMAScript features
    sourceType: 'module',  // Allows for the use of imports
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true, allowTypedFunctionExpressions: true }],
    '@typescript-eslint/indent': 'off',
    'class-methods-use-this': ['error', { 'exceptMethods': ['componentDidCatch', 'componentDidAppear', 'componentDidDisappear'] }],
    'import/no-unresolved': ['error', { ignore: ['@app', '.'] }],
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'indent': 'off',
    'max-len': ['error', 400],
    'no-console': 'error',
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['draft', 'draftState', 'context'] }],
    'no-unused-expressions': ['error', { 'allowShortCircuit': true }],
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'object-curly-newline': ['error', {
      'ObjectExpression': { 'multiline': true, 'minProperties': 2 },
      'ObjectPattern': { 'multiline': true },
      'ImportDeclaration': { 'multiline': true },
      'ExportDeclaration': { 'multiline': true }
    }],
    '@typescript-eslint/no-explicit-any': ['error'],
    'no-null/no-null': ['error'],
    'no-underscore-dangle': ["error", { "allow": ["_id", "__resolveType", "__v"] }],
    'react/prop-types': 'off',
  }
};
