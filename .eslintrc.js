module.exports = {
  env: {
    webextensions: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    // We should turn these from warnings to errors.
    "no-undef": 1,
    "no-unused-vars": 1,
    "indent": ["error", 4]
  },
};
