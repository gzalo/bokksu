module.exports = {
  env: {
    browser: true,
    es6: true,
    jquery: true,
    node: true,
  },

  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    parser: 'babel-eslint',
  },

  plugins: ['vue'],

  rules: {
    'linebreak-style': 0,
    'global-require': 0,
    'implicit-arrow-linebreak': 0,
    'eslint linebreak-style': [0, 'error', 'windows'],
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['state', 'acc', 'e', 'ctx', 'req', 'request', 'res', 'response', '$scope'],
      },
    ],
    'max-len': [
      'error',
      {
        code: 350,
      },
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },

  root: true,

  extends: ['plugin:vue/essential', 'airbnb-base', '@vue/airbnb'],
};
