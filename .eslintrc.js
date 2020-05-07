module.exports = {
  env: {
    webextensions: true,
  },
  extends: "eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    // We should turn these from warnings to errors.
    "no-prototype-builtins": 1,
    "no-redeclare": 1,
    "no-undef": 1,
    "no-unused-vars": 1,
    "indent": ["error", 4]
  },
};
