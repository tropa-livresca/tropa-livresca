import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "warn",
    },
  },

  {
    files: ["tests/**/*.js", "**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
