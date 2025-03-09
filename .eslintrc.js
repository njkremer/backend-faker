module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'es2021': true
  },
  'extends': 'eslint:recommended',
  'overrides': [
    {
      'env': { 'node': true },
      'files': ['.eslintrc.{js,cjs}'],
      'parserOptions': { 'sourceType': 'script' }
    }
  ],
  'parserOptions': {
    'ecmaVersion': 'latest'
  },
  'rules': {
    'brace-style': ['warn', 'stroustrup', { 'allowSingleLine': false }],
    'curly': ['warn', 'all'],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'linebreak-style': ['error', 'unix'],
    'multiline-ternary': ['warn', 'always'],
    'no-console': process.env.NODE_ENV === 'production'
      ? 'error'
      : 'off',
    'no-debugger': process.env.NODE_ENV === 'production'
      ? 'error'
      : 'off',
    'no-multi-spaces': ['error'],
    'operator-linebreak': ['warn', 'before', {
      'overrides': {
        '+': 'ignore',
        '=': 'ignore',
        '==': 'ignore',
        '===': 'ignore',
        '&&': 'ignore',
        '&': 'ignore',
        '||': 'ignore',
        '|': 'ignore'
      }
    }],
    'quotes': ['error', 'single', { 'avoidEscape': true }],
    'semi': ['error', 'always']
  }
};
