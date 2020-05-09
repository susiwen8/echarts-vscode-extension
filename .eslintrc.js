module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
    ],
    rules: {
        'no-trailing-spaces': 'error',
        'default-case': 'error',
        'eqeqeq': 'error',
        'no-debugger': 'error',
        'no-extra-semi': 'error',
        'no-irregular-whitespace': 'error',
        'no-unreachable': 'error',
        'no-else-return': 'error',
        'no-fallthrough': 'error',
        'no-multi-spaces': 'error',
        'space-infix-ops': 'error',
        'quotes': [2, 'single'],
        'camelcase': 'error',
        'no-var': 'error',
        'object-curly-spacing': ['error', 'always'],
        'no-tabs': 'error',
        'semi': ['error', 'always'],
        '@typescript-eslint/no-non-null-assertion': 'off',
        'indent': ['error', 4, {
            'SwitchCase': 1
        }]
    }
  };