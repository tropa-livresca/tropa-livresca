import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "all",
          ignoreRestSiblings: false,
          argsIgnorePattern: "^_",
        },
      ],

      "no-console": [
        "error",
        {
          allow: ["warn", "error"],
        },
      ],

      "no-unused-expressions": [
        "error",
        {
          allowShortCircuit: false,
          allowTernary: false,
          allowTaggedTemplates: false,
        },
      ],

      "no-useless-assignment": "error",
      "no-useless-return": "error",
      "no-useless-concat": "error",
      "no-useless-computed-key": "error",
      "no-useless-constructor": "error",
      "no-useless-rename": "error",
      "no-useless-escape": "error",
      "no-useless-catch": "error",
      "no-useless-call": "error",
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
