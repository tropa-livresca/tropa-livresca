import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/use-memo": "off",

      "no-console": [
        "error",
        {
          allow: ["warn", "error"],
        },
      ],

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
]);
